# Angular tree shaking issue

This is a reproduction repo for conditionally imported module being included in the bundle because of how environment is structured and accessed.

## Runnning

- `yarn && npm run build` - builds the project.
- `npm run analyse` - runs the `webpack-bundle-analyzer` to see the bundle size increase

## What's wrong?

Bundle size should be **132KB** but it's **325KB** as conidtionally included unused module is still in the bundle.

## Why ?

`TestModule` is included in `AppModule` conditionally using
```
imports: [BrowserModule, environment.includeModule ? TestModule : []],

```
environment file is imported from `../environments/environment` and has the following structure:
```
export const environment = {
  production: true,
  includeModule: false,
  nestedObject: {
    childProperty: 'just testing',
  },
};

```
So there's a nested structure in exported `environment` const.
We are accessing the nested structure in `AppModule`:
```
  providers: [
    { provide: new InjectionToken('Test'), useValue: environment.nestedObject },
                                                                 ^^^^^^^^^^^^
  ],
```
Somehow this causes webpack to be uncertain of the value of `environment.includeModule` and `TestModule` gets always included in the bundle.

To confirm that's the case just reconstruct the object in `AppModule` instead of using accessing non primitive structure from environment in the following way:

```
  providers: [
    {
      provide: new InjectionToken('Test'),
      useValue: {
        childProperty: environment.nestedObject.childProperty,
      },
    },
  ],
```

After that change just run `npm run build && npm run analyse` to confirm the `TestModule` is not included in the main bundle.
