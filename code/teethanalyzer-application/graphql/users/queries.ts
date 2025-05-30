import * as userService from "mongoose/users/services";

export const userQueries = {
  getUserById: (_: any, { userId }: { userId: string }) =>
    userService.findUserById(userId),
  getUserByOauthId: (_: any, { oauthId }: { oauthId: string }) =>
    userService.findUserByOauthId(oauthId),
};
