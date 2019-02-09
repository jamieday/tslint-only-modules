# tslint-only-modules
A TSLint rule that restricts all typescript source files to be modules.

## Rationale
In projects which ubiquitously use ES6 modules, a file having no imports or exports is a red flag.
As of ES6, any file containing a top-level import or export is considered a module; however, if a file contains no top-level import or export declarations, its contents will be exposed as available in the global scope.

Having a hybrid mix of ES6 modules and global-scope scripts can lead to unexpected behavior. Perhaps the file isn't truly accessible in the global scope after webpack compilation - in this case, it could result in a fatal error which would not get caught until run-time.
