export interface RequestWithUser extends Request {
  user: {
    _id: string;
    roles: string[];
    [key: string]: any;
  };
}
