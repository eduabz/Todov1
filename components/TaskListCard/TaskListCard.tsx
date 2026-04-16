import { router } from "expo-router";
import React from "react";
import { Pressable } from "react-native";
import { Box } from "../ui/box";
import { Progress } from "../ui/progress";
import { Text } from "../ui/text";

import { TaskList } from "@/type/TaskList";



const TaskListCard: React.FC<{ item: TaskList }> = ({ item }) => {
  
  const handlePress = () => {
    router.push(`/lists/${item.id}`);
  };

  return (
    <Pressable 
      className="p-4 border border-gray-300 rounded-xl mb-3 active:opacity-70"
      onPress={handlePress}
    >
      <Text className="text-lg font-semibold">{item.title}</Text>
      <Text className="text-sm text-gray-500">{item.subtitle}</Text>


      <Box className="mt-2"> 
        <Progress value={item.percentage} size="md" />
        <Text className="text-xs text-gray-500 mt-1">{item.percentage}%</Text>
      </Box>
    </Pressable>
  );
};

export default TaskListCard;