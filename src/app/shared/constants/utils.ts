export const STORE_USER = 'geo_business_user';
export const STORE_USER_PROFILE = 'geo_business_user_profile';
export const IS_USER_PROFILE_LOADED = 'geo_business_isProfileInfoLoaded';
export const STORE_USER_LOCATION = 'geo_business_user_location';
export const STORE_ACTIVE_TAB_URL = 'geo_business_active_tab_url';

export interface AppDeviceInfo {
  platform?: string;
  operatingSystem?: string;
  browser?: string;
  device?: string;
  osVersion?: string;
  browserVersion?: string;
  isDesktop?: boolean;
  isMobile?: boolean;
  isTablet?: boolean;
}
