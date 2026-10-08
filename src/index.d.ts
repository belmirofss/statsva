export declare global {
  namespace ReactNavigation {
    interface RootParamList {
      Home: undefined;
      Activities: undefined;
      Insights: undefined;
      Account: undefined;
      About: undefined;
      Activity: {
        id: number;
      };
      YearInReview: undefined;
      Streaks: undefined;
      Compare: undefined;
      Perspective: undefined;
      Fitness: undefined;
      TimeOfDay: undefined;
      Explorer: undefined;
      Gear: undefined;
      Segment: {
        id: number;
        name?: string;
      };
    }
  }

  declare module "*.png";
  declare module "*.ttf";
}
