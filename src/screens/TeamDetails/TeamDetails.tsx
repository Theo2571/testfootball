import React, { useEffect } from 'react';
import {
  ScrollView,
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  Image,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { RootStackParamList } from '@/types/navigation';
import {
  clear,
  fetchMatches,
  fetchTeam,
} from '@/store/features/teamDetails/teamDetailsSlice';

type Props = StackScreenProps<RootStackParamList, 'TeamDetails'>;

const TeamDetails: React.FC<Props> = ({ route }) => {
  const { id } = route.params;
  const dispatch = useAppDispatch();
  const { entity, matches, status, error } = useAppSelector(s => s.teamDetails);

  useEffect(() => {
    const load = async () => {
      const result = await dispatch(fetchTeam(id));
      if (fetchTeam.fulfilled.match(result)) {
        await dispatch(fetchMatches(id));
      }
    };

    load();
  }, [dispatch, id]);
  if (status === 'failed') {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>❌ {error}</Text>
        <Text style={styles.errorText}>
          Как я понял, на некоторые команды нельзя зайти, так как они доступны
          только по платной подписке, поэтому кидает 403.
        </Text>
      </View>
    );
  }
  if (status === 'loading' || !entity) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  const opponent = (m: (typeof matches)[number]) =>
    m.homeTeam.name === entity.name ? m.awayTeam.name : m.homeTeam.name;

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'short',
    });

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={{ uri: entity.crest }} style={styles.crest} />
        <Text style={styles.title}>{entity.name}</Text>
        <Text style={styles.subtitle}>
          {entity.area.name} · {entity.founded ?? '—'}
        </Text>

        <View style={styles.block}>
          <Text style={styles.blockTitle}>Инфо</Text>
          <InfoRow label="Стадион" value={entity.venue} />
          <InfoRow label="Адрес" value={entity.address} />
          <InfoRow label="Цвета" value={entity.clubColors} />
          {entity?.website && (
            <InfoRow
              label="Сайт"
              value={entity.website.replace(/^https?:\/\//, '')}
              onPress={() => Linking.openURL(entity.website)}
            />
          )}
        </View>

        {entity.runningCompetitions.length > 0 && (
          <View style={styles.block}>
            <Text style={styles.blockTitle}>Соревнования</Text>
            {entity?.runningCompetitions.map(c => (
              <Text key={c.id} style={styles.text}>
                • {c.name}
              </Text>
            ))}
          </View>
        )}

        <View style={styles.block}>
          <Text style={styles.blockTitle}>Состав</Text>
          {entity.squad.length === 0 ? (
            <Text style={styles.textMuted}>Состав недоступен</Text>
          ) : (
            entity.squad.map(p => (
              <Text key={p.id} style={styles.text}>
                • {p.name} {p.position && `(${p.position})`}
              </Text>
            ))
          )}
        </View>

        <View style={styles.block}>
          <Text style={styles.blockTitle}>Ближайшие матчи</Text>
          {matches.length === 0 ? (
            <Text style={styles.textMuted}>Нет запланированных игр</Text>
          ) : (
            matches.map(m => (
              <View key={m.id} style={styles.matchRow}>
                <Text style={styles.text}>{opponent(m)}</Text>
                <Text style={styles.textMuted}>
                  {fmtDate(m.utcDate)} — {m.competition.name}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const InfoRow: React.FC<{
  label: string;
  value: string | null;
  onPress?: () => void;
}> = ({ label, value, onPress }) =>
  value ? (
    <Text
      style={styles.text}
      onPress={onPress}
      numberOfLines={1}
      ellipsizeMode="tail"
    >
      {label}: <Text style={onPress ? styles.link : undefined}>{value}</Text>
    </Text>
  ) : null;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1f2937',
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1f2937',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  crest: {
    width: 72,
    height: 72,
    alignSelf: 'center',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1f2937',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
  },
  subtitle: {
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 16,
  },
  block: {
    marginTop: 20,
  },
  blockTitle: {
    color: '#22d3ee',
    fontWeight: '600',
    marginBottom: 8,
  },
  text: {
    color: '#e5e7eb',
    lineHeight: 22,
  },
  textMuted: {
    color: '#9ca3af',
    lineHeight: 22,
  },
  link: {
    textDecorationLine: 'underline',
    color: '#60a5fa',
  },
  matchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
});

export default TeamDetails;
