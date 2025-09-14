export const Events = {
  // subscriptions
  SUBSCRIBE_MINI: 'client:session:mini:subscribe',
  SUBSCRIBE_BY_ID: 'client:session:byId:subscribe',
  UNSUBSCRIBE: 'client:unsubscribe',

  // server 
  MINI_DATA: 'client:session:mini:data',
  BY_ID_DATA: 'client:session:byId:data',
} as const;
