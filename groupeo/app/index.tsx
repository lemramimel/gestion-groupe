import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { db,expo } from '@/db/database';
import migrations from "@/drizzle/migrations";

export default function HomeScreen() {
  useDrizzleStudio(expo);
  const { success, error } = useMigrations(db, migrations);
 
    return (
      <View className='flex-1 items-center justify-center'>
        <Text className='font-bold'> Tongasoa ato @ News eh </Text>
        
      </View>
    )

}
