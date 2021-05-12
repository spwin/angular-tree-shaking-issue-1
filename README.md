# AngularConditionalImportIssue

This is a reproduction repo for conditionally imported module being included in the bundle anyway.

## Runnning

- `yarn && npm run build` - builds the project.
- `npm run analyse` - runs the `webpack-bundle-analyzer` to see the bundle size increase

## What's wrong?

Bundle size should be **94KB** but it's **307KB** as conidtionally included unused module is still in the bundle.


## Main points:
`TestModule` is included in `AppModule` conditionally using
```
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, includeTestModule ? TestModule : []],
  bootstrap: [AppComponent],
})
export class AppModule {}

```


`TestModule` is including big enum (just to see the bundle increase)
```
import * as types from './types';
```


Builgin with `--prod` to have the optimizations on. Also added `--stats-json` flag to be able to see more details for including `TestModule`.


To see how it should look like make the following change to `app.module.ts`:

**BEFORE**:
```
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { TestModule } from './test.module';

const includeTestModule = false;
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, includeTestModule ? TestModule : []],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

**AFTER**:
```
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

Now run `npm run build && npm run analyse` to see the main bundle size is **94KB**


Excerpt from `stats.json` on `./types` where `TestEnum` is defined:
```

{
  "id": null,
  "identifier": "/home/smarkevic/ng-test/angular-conditional-import-issue/node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js??ref--7-0!/home/smarkevic/ng-test/angular-conditional-import-issue/node_modules/@angular-devkit/build-optimizer/src/build-optimizer/webpack-loader.js??ref--7-1!/home/smarkevic/ng-test/angular-conditional-import-issue/node_modules/@angular-devkit/build-optimizer/src/build-optimizer/webpack-loader.js??ref--16-0!/home/smarkevic/ng-test/angular-conditional-import-issue/node_modules/@ngtools/webpack/src/ivy/index.js!/home/smarkevic/ng-test/angular-conditional-import-issue/src/app/types.ts",
  "name": "./src/app/types.ts",
  "index": 56,
  "index2": 52,
  "size": 387829,
  "cacheable": true,
  "built": true,
  "optional": false,
  "prefetched": false,
  "chunks": [],
  "issuer": "/home/smarkevic/ng-test/angular-conditional-import-issue/node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js??ref--7-0!/home/smarkevic/ng-test/angular-conditional-import-issue/node_modules/@angular-devkit/build-optimizer/src/build-optimizer/webpack-loader.js??ref--7-1!/home/smarkevic/ng-test/angular-conditional-import-issue/node_modules/@angular-devkit/build-optimizer/src/build-optimizer/webpack-loader.js??ref--16-0!/home/smarkevic/ng-test/angular-conditional-import-issue/node_modules/@ngtools/webpack/src/ivy/index.js!/home/smarkevic/ng-test/angular-conditional-import-issue/src/app/test.module.ts",
  "issuerId": null,
  "issuerName": "./src/app/test.module.ts",
  "issuerPath": [
    {
      "id": 0,
      "identifier": "multi /home/smarkevic/ng-test/angular-conditional-import-issue/src/main.ts",
      "name": "multi ./src/main.ts",
      "profile": {
        "factory": 0,
        "building": 2
      }
    },
    {
      "id": null,
      "identifier": "/home/smarkevic/ng-test/angular-conditional-import-issue/node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js??ref--7-0!/home/smarkevic/ng-test/angular-conditional-import-issue/node_modules/@angular-devkit/build-optimizer/src/build-optimizer/webpack-loader.js??ref--7-1!/home/smarkevic/ng-test/angular-conditional-import-issue/node_modules/@angular-devkit/build-optimizer/src/build-optimizer/webpack-loader.js??ref--16-0!/home/smarkevic/ng-test/angular-conditional-import-issue/node_modules/@ngtools/webpack/src/ivy/index.js!/home/smarkevic/ng-test/angular-conditional-import-issue/src/main.ts",
      "name": "./src/main.ts",
      "profile": {
        "factory": 122,
        "building": 76
      }
    },
    {
      "id": null,
      "identifier": "/home/smarkevic/ng-test/angular-conditional-import-issue/node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js??ref--7-0!/home/smarkevic/ng-test/angular-conditional-import-issue/node_modules/@angular-devkit/build-optimizer/src/build-optimizer/webpack-loader.js??ref--7-1!/home/smarkevic/ng-test/angular-conditional-import-issue/node_modules/@angular-devkit/build-optimizer/src/build-optimizer/webpack-loader.js??ref--16-0!/home/smarkevic/ng-test/angular-conditional-import-issue/node_modules/@ngtools/webpack/src/ivy/index.js!/home/smarkevic/ng-test/angular-conditional-import-issue/src/app/app.module.ts",
      "name": "./src/app/app.module.ts",
      "profile": {
        "factory": 1036,
        "building": 4052,
        "dependencies": 935
      }
    },
    {
      "id": null,
      "identifier": "/home/smarkevic/ng-test/angular-conditional-import-issue/node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js??ref--7-0!/home/smarkevic/ng-test/angular-conditional-import-issue/node_modules/@angular-devkit/build-optimizer/src/build-optimizer/webpack-loader.js??ref--7-1!/home/smarkevic/ng-test/angular-conditional-import-issue/node_modules/@angular-devkit/build-optimizer/src/build-optimizer/webpack-loader.js??ref--16-0!/home/smarkevic/ng-test/angular-conditional-import-issue/node_modules/@ngtools/webpack/src/ivy/index.js!/home/smarkevic/ng-test/angular-conditional-import-issue/src/app/test.module.ts",
      "name": "./src/app/test.module.ts",
      "profile": {
        "factory": 935,
        "building": 9,
        "dependencies": 910
      }
    }
  ],
  "profile": {
    "factory": 899,
    "building": 882
  },
  "failed": false,
  "errors": 0,
  "warnings": 0,
  "assets": [],
  "reasons": [
    {
      "moduleId": null,
      "moduleIdentifier": "/home/smarkevic/ng-test/angular-conditional-import-issue/node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js??ref--7-0!/home/smarkevic/ng-test/angular-conditional-import-issue/node_modules/@angular-devkit/build-optimizer/src/build-optimizer/webpack-loader.js??ref--7-1!/home/smarkevic/ng-test/angular-conditional-import-issue/node_modules/@angular-devkit/build-optimizer/src/build-optimizer/webpack-loader.js??ref--16-0!/home/smarkevic/ng-test/angular-conditional-import-issue/node_modules/@ngtools/webpack/src/ivy/index.js!/home/smarkevic/ng-test/angular-conditional-import-issue/src/app/test.module.ts",
      "module": "./src/app/test.module.ts",
      "moduleName": "./src/app/test.module.ts",
      "type": "harmony side effect evaluation",
      "userRequest": "./types",
      "loc": "2:0-33"
    },
    {
      "moduleId": null,
      "moduleIdentifier": "/home/smarkevic/ng-test/angular-conditional-import-issue/node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js??ref--7-0!/home/smarkevic/ng-test/angular-conditional-import-issue/node_modules/@angular-devkit/build-optimizer/src/build-optimizer/webpack-loader.js??ref--7-1!/home/smarkevic/ng-test/angular-conditional-import-issue/node_modules/@angular-devkit/build-optimizer/src/build-optimizer/webpack-loader.js??ref--16-0!/home/smarkevic/ng-test/angular-conditional-import-issue/node_modules/@ngtools/webpack/src/ivy/index.js!/home/smarkevic/ng-test/angular-conditional-import-issue/src/app/test.module.ts",
      "module": "./src/app/test.module.ts",
      "moduleName": "./src/app/test.module.ts",
      "type": "harmony import specifier",
      "userRequest": "./types",
      "loc": "5:16-21"
    }
  ],
  "usedExports": true,
  "providedExports": [
    "TestEnum"
  ],
  "optimizationBailout": [],
  "depth": 4
}

```
# angular-tree-shaking-issue-1
