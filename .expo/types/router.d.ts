/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(tabs)` | `/(tabs)/` | `/(tabs)/inventory` | `/(tabs)/profile` | `/(tabs)/recipes` | `/_sitemap` | `/inventory` | `/oboarding` | `/profile` | `/recipes`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
