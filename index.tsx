import { registerRootComponent } from "expo";
import { ExpoRoot } from "expo-router";


const STORYBOOK_ENABLED = false;

if (STORYBOOK_ENABLED) {
  const StorybookUI = require("./.storybook").default;
  registerRootComponent(StorybookUI);
} else {
  function App() {
    const ctx = require.context("./app");
    return <ExpoRoot context={ctx} />;
  }
  registerRootComponent(App);
}
