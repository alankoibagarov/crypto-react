import { LOGIN_TIMEOUT } from '@const';
import { userList } from '@const/userList';
import { delay } from '@utils';

export interface UserListItem {
  login: string;
  password: string;
}

export const fetchUserList = async (): Promise<UserListItem[]> => {
  await delay(Math.random() * LOGIN_TIMEOUT);

  return userList;
};
