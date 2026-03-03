
    export type RemoteKeys = 'ssoUtils/client';
    type PackageType<T> = T extends 'ssoUtils/client' ? typeof import('ssoUtils/client') :any;