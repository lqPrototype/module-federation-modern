
    export type RemoteKeys = 'remote/Image' | 'remote/Button' | 'remote/app';
    type PackageType<T> = T extends 'remote/app' ? typeof import('remote/app') :T extends 'remote/Button' ? typeof import('remote/Button') :T extends 'remote/Image' ? typeof import('remote/Image') :any;