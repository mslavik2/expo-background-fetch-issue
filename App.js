import React from "react";
import { StyleSheet, Text, View } from "react-native";

import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";

const BACKGROUND_TASK = "BACKGROUND_TASK";

TaskManager.defineTask(BACKGROUND_TASK, async taskBody => {
  try {
    console.log("It should print 42 right after this:");
    const prom = new Promise((resolve, reject) => {
      setTimeout(() => resolve(42), 1);
    });

    const val = await prom;
    console.log(val);
    return BackgroundFetch.Result.NewData;
  } catch (err) {
    console.log(`Error occurred while running task:`, err);
    return BackgroundFetch.Result.Failed;
  }
});

BackgroundFetch.getStatusAsync().then(status => {
  if (
    status === BackgroundFetch.Status.Restricted ||
    status === BackgroundFetch.Status.Denied
  ) {
    console.log("Background fetch is disabled.");
    return;
  }

  BackgroundFetch.setMinimumIntervalAsync(10 * 60).then(() => {
    BackgroundFetch.registerTaskAsync(BACKGROUND_TASK, {
      minimumInterval: 10 * 60,
      stopOnTerminate: true,
      startOnBoot: false
    }).then(
      () => {
        console.log("Background update task registered.");
      },
      err => {
        console.log("Filed to register task for background.", err);
      }
    );
  });
});

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
