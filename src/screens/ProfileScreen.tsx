// File: src/screens/ProfileScreen.tsx
import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { AppContext } from '../../App'; // Adjust path as needed

const ProfileScreen: React.FC = () => {
  const appContext = useContext(AppContext);

  // Check if appContext is null
  if (!appContext) {
    return (
      <View style={profileScreenStyles.loadingContainer}>
        <Text style={profileScreenStyles.loadingText}>Loading app context...</Text>
      </View>
    );
  }

  const { userId } = appContext;
  // Mock data for the chart
  const chartData: number[] = [2, 3, 1, 4, 2, 5];
  const chartLabels: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  return (
    <View style={profileScreenStyles.screenPadding}>
      <Text style={profileScreenStyles.pageTitle}>My Profile</Text>
      <View style={profileScreenStyles.profileCard}>
        <Image source={{ uri: `https://placehold.co/100x100/E2E8F0/4A5568?text=User` }} style={profileScreenStyles.avatar} />
        <View>
          <Text style={profileScreenStyles.profileName}>Alex Reader</Text>
          <Text style={profileScreenStyles.profileEmail}>User ID: {userId}</Text>
        </View>
      </View>
      <View style={profileScreenStyles.chartContainer}>
        <Text style={profileScreenStyles.chartTitle}>Reading Activity</Text>
        <View style={profileScreenStyles.barChart}>
          {chartData.map((value, index) => (
            <View key={index} style={profileScreenStyles.barContainer}>
              <View style={[profileScreenStyles.bar, { height: value * 30 }]} />
              <Text style={profileScreenStyles.barLabel}>{chartLabels[index]}</Text>
              <Text style={profileScreenStyles.barValue}>{value}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const profileScreenStyles = StyleSheet.create({
  screenPadding: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '600',
    color: '#262626',
    marginBottom: 24,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
    backgroundColor: '#e2e8f0',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#262626',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#525252',
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    height: 300,
    maxHeight: 350,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#262626',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    width: '100%',
    height: '100%',
    paddingHorizontal: 10,
  },
  barContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    marginHorizontal: 5,
  },
  bar: {
    width: '80%',
    backgroundColor: 'rgba(59, 130, 246, 0.7)',
    borderRadius: 4,
  },
  barLabel: {
    fontSize: 12,
    color: '#404040',
    marginTop: 5,
  },
  barValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#262626',
    marginBottom: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#737373',
  },
});

export default ProfileScreen;
