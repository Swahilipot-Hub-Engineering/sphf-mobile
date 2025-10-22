import React, { useState } from 'react';
import { Text, TouchableOpacity, View, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { ScheduleList } from 'components/ScheduleList';
import { SpeakersList } from 'components/SpeakersList';
import { Loader } from 'components/Loader';

import './global.css';

export default function App() {
  const [tab, setTab] = useState<'schedule' | 'speakers'>('schedule');
  const [isLoading, setIsLoading] = useState(false);

  const handleSetTab = (next: 'schedule' | 'speakers') => {
    if (next === tab) return;
    setIsLoading(true);
    // Simulate a short loading period. Replace this with your real async fetch logic.
    setTimeout(() => {
      setTab(next);
      setIsLoading(false);
    }, 500);
  };

  return (
    <View className="flex-1 bg-white ios:pt-0 pt-8">
      <View className="flex-row items-center border-b border-gray-200 bg-[#e97b35] px-4 pb-2 ios:pt-16 pt-4">
        <Image
          source={require('./assets/piw-logo.png')}
          className="mr-3 h-14 w-40"
          resizeMode="contain"
        />
      </View>

      <View className="flex-1 pb-16">{tab === 'schedule' ? <ScheduleList /> : <SpeakersList />}</View>

      <BottomTabBar tab={tab} setTab={handleSetTab} />

      <Loader visible={isLoading} message="Loading..." />
      <StatusBar style="auto" />
    </View>
  );
}

const BottomTabBar = ({
  tab,
  setTab,
}: {
  tab: 'schedule' | 'speakers';
  setTab: (t: 'schedule' | 'speakers') => void;
}) => {
  return (
    <View className="absolute bottom-4 pb-1 left-4 right-4">
      <View className="mx-2 bg-[#e97b35] flex-row justify-around rounded-full py-2 shadow-lg">
        <TabItem
          label="Schedule"
          active={tab === 'schedule'}
          icon={(active) => (
            <Ionicons
              name={active ? 'calendar' : 'calendar-outline'}
              size={22}
              color={active ? '#fff' : '#000'}
            />
          )}
          onPress={() => setTab('schedule')}
        />
        <TabItem
          label="Speakers"
          active={tab === 'speakers'}
          icon={(active) => (
            <Ionicons
              name={active ? 'people' : 'people-outline'}
              size={22}
              color={active ? '#fff' : '#000'}
            />
          )}
          onPress={() => setTab('speakers')}
        />
      </View>
    </View>
  );
};

const TabItem = ({
  label,
  active,
  icon,
  onPress,
}: {
  label: string;
  active: boolean;
  icon: (active: boolean) => React.ReactNode;
  onPress: () => void;
}) => (
  <TouchableOpacity onPress={onPress} className="items-center gap-1 px-3 py-1" accessibilityRole="button">
    {icon(active)}
    <Text className={`${active ? '#fff' : '#000'} text-xs font-medium`}>{label}</Text>
  </TouchableOpacity>
);
