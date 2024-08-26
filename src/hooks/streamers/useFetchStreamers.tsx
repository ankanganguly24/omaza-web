import { QueryFunctionContext, useInfiniteQuery } from '@tanstack/react-query';

import { apiGet } from '@/utils/api';

export type Streamer = {
  id: number;
  name: string;
  aboutMe: string;
  age: number;
  audioCalls: boolean;
  audioUserRate: number;
  audioVipRate: number;
  busy: boolean;
  callCount: number;
  city: string;
  displayRate: number;
  facePic: string;
  fake: boolean;
  followerCount: number;
  gender: string;
  interests: string[];
  languages: string[];
  live: boolean;
  livestreamDetails: null | object;
  livestreamId: null | string;
  minUserLevelIdForCall: null | number;
  minUserLevelNameForCall: null | string;
  newUser: boolean;
  noCallsDuringLivestream: boolean;
  online: boolean;
  onlyPremiumUsers: boolean;
  premium: boolean;
  profilePic: string;
  recommended: boolean;
  score: number;
  serviceLine: string;
  vipCallRate: number;
};

type ApiResponse = Streamer[];

// Custom hook to handle the fetching of streamers
export const useFetchStreamers = () => {
  return useInfiniteQuery<ApiResponse, Error>({
    queryKey: ['streamers'], // Query key
    queryFn: async ({
      pageParam = 0,
    }: QueryFunctionContext): Promise<ApiResponse> => {
      const response = await apiGet<ApiResponse>(
        `user/fetch/streamers-v2?page=${pageParam}&pageSize=20`,
      );
      return response;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 20 ? allPages.length : undefined;
    },
  });
};
