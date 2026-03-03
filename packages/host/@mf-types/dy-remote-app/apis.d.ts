
    export type RemoteKeys = 'dy-remote-app/Image' | 'dy-remote-app/Button' | 'dy-remote-app/app';
    type PackageType<T> = T extends 'dy-remote-app/app' ? typeof import('dy-remote-app/app') :T extends 'dy-remote-app/Button' ? typeof import('dy-remote-app/Button') :T extends 'dy-remote-app/Image' ? typeof import('dy-remote-app/Image') :any;