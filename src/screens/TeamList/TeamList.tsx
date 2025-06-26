import React, { useEffect } from 'react';
import {
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ListRenderItem,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { TeamShort } from '@/types/football';
import { fetchTeams, reset } from '@/store/features/teams/teamsSlice';

interface TeamListProps {
  navigation: any;
}

const TeamList: React.FC<TeamListProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { data, page, total, status } = useAppSelector(s => s.teams);

  useEffect(() => {
    if (data.length === 0) {
      dispatch(fetchTeams(0));
    }
  }, []);

  const renderItem: ListRenderItem<TeamShort> = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate('TeamDetails', { id: item.id })}
    >
      <Image
        source={{ uri: item.crest }}
        style={styles.teamImage}
        resizeMode="contain"
      />
      <Text style={styles.teamName}>{item.name}</Text>
    </TouchableOpacity>
  );
  const loadMore = () => {
    console.log('loading more...', page, data.length, total);
    if (status !== 'loading' && data.length < total) {
      dispatch(fetchTeams(page));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {status === 'failed' && (
        <Text style={styles.errorText}>
          Ошибка загрузки. Попробуйте ещё раз.
        </Text>
      )}

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={t => String(t.id)}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{ paddingBottom: 16 }}
        ListFooterComponent={() => {
          if (status === 'loading') {
            return (
              <View style={styles.loaderContainer}>
                <ActivityIndicator color="#fff" />
              </View>
            );
          }
          if (data.length < total) {
            return (
              <TouchableOpacity style={styles.loadBtn} onPress={loadMore}>
                <Text style={styles.loadText}>Показать ещё</Text>
              </TouchableOpacity>
            );
          }
          return null;
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f2937',
  },
  loaderContainer: {
    paddingVertical: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  teamImage: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  teamName: {
    color: '#fff',
    fontSize: 16,
  },
  errorText: {
    color: '#f87171',
    textAlign: 'center',
    marginVertical: 16,
  },
  loadBtn: {
    alignSelf: 'center',
    marginVertical: 12,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#374151',
  },
  loadText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default TeamList;
