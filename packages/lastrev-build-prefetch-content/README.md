# LastRev Content Prefetcher

The purpose of this command line tool is to pre-fetch content for LastRev projects prior to running the next build (or any other build). This saves build time on frequently accessed objects such as global settings. The script also generates some useful files such as the adapter config and component mappings.

## Usage

```bash
npm install --save-dev @last-rev/build-content-prefetcher
npx lr-prefetch
```

or, in an npm script:

```json
{
  //...
  "scripts": {
    "build:pre": "lr-prefetch"
  }
}
```

## Configuration

The project is configured via the JSON syntaxed `.lastrevrc` file in the root of your project.

| **Property**                                  | **Type**              | **Function**                                                                                                                                                                            |
| --------------------------------------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| useAdapter                                    | boolean               | Whether to use the adapter to transform the data fetched from contentful. If this is true, another property at the root of the file should be configured for the adapter config to use. |
| writeMappings                                 | boolean               | Whether to write the component mappings file.                                                                                                                                           |
| writeSettings                                 | boolean               | Whether to write the settings file.                                                                                                                                                     |
| writeAdapterConfig                            | boolean               | Whether to write the adapter config file.                                                                                                                                               |
| writePaths                                    | boolean               | Whether to write the paths file.                                                                                                                                                        |
| writeLocaleData                               | boolean               | Whether to write the i18n.json and locale lookup files.                                                                                                                                 |
| settingsInclude                               | number                | the levels of depth to grab in the GlobalSettings object.                                                                                                                               |
| settingsContentType                           | string                | The contentTypeId of the GlobalSettings type.                                                                                                                                           |
| mappings                                      | object                | Configure the component mapper. See below.                                                                                                                                              |
| mappings.overrides                            | Record<string,string> | Key value pair of content type id to component name, overriding the default pascalCase lookup of component.                                                                             |
| mappings.exclude                              | string[]              | An array of component names to exclude form the mappings. This is useful to avoid circular dependencies, which will break storybook functionality.                                      |
| locales                                       | object                | Configure the locales data writer. See below.                                                                                                                                           |
| locales.localizationLookupFieldName           | string                | The name of the localizationLookup field in the global settings object .                                                                                                                |
| locales.rawPagesDir                           | string                | The name of the un-translated pages directory.                                                                                                                                          |
| locales.loutputPath                           | string                | The name of the locales directory.                                                                                                                                                      |
| writeContentJson                              | boolen                | Whether or not to write JSON files for the content to be used to render the pages.                                                                                                      |
| contentPrefetch                               | object                | A configuration object keyed by content type.                                                                                                                                           |
| contentPrefetch.{contentType}.slugField       | string                | the name of the field used for the slug of this content type.                                                                                                                           |
| contentPrefetch.{contentType}.include         | number                | The depth to which nested referenced entries are expanded.                                                                                                                              |
| contentPrefetch.{contentType}.rootOmitFields  | string[]              | An array of field names to omit from the page object at the root level.                                                                                                                 |
| contentPrefetch.{contentType}.childOmitFields | string[]              | An array of field names to omit from nested entries at all child levels.                                                                                                                |
| writeNestedPaths                              | boolean               | Whether to use the nestedPaths config to build complex path params (see below)                                                                                                          |
| nestedPaths                                   | object                | An object, keyed by contentTypeId declaring the paths to write to the paths file                                                                                                        |
| nestedPaths{contentTypeId}                    | object                | Each nested path is configured with a key value pair where the key is the name of the param and the value is the field path within the content item                                     |

example

```json
{
  "build": {
    "useAdapter": true,
    "writeSettings": true,
    "writeAdapterConfig": true,
    "writePaths": true,
    "writeLocaleData": true,
    "writeMappings": true,
    "settingsInclude": 10,
    "writeContentJson": true,
    "paths": {
      "pageGeneral": "slug",
      "pageRecipe": "slug",
      "nestedPageRecipeStep": {
        "param": "slug",
        "contentType": "recipe",
        "children": {
          "param": "stepslug",
          "fieldName": "steps"
        }
      }
    },
    "nestedPaths": {
      "pageAccelerator": {
        "slug": "slug"
      },
      "pagePost": {
        "category": "categoryPostColType.slug",
        "post": "slug"
      },
      "categoryPostColumnType": {
        "cateogry": "slug"
      }
    },
    "mappings": {
      "exclude": ["PageGeneral"],
      "overrides": {
        "settingsGlobal": "Layout",
        "globalFooter": "Footer"
      }
    },
    "contentPrefetch": {
      "pageCourseTopic": {
        "slugField": "slug",
        "include": 5,
        "rootOmitFields": ["internalTitle"],
        "childOmitFields": ["tags", "contentSections", "content", "internalTitle", "seo"]
      }
    }
  },
  "adapter": {
    "urlMap": {
      "pageGeneral": {
        "url": "/[key]",
        "key": "slug"
      },
      "pageRecipe": {
        "url": "recipes/[key]",
        "key": "slug"
      }
    }
  }
}
```

### Configuring paths

Paths can either be a mapping of sontentType to parameter:

```json
{
  "paths": {
    "pageRecipe": "slug"
  }
}
```

or a more complex object where children parameters can be defined:

```json
{
  "paths": {
    "nestedPageRecipeStep": {
      "param": "slug",
      "contentType": "recipe",
      "children": {
        "param": "stepslug",
        "fieldName": "steps",
        "children": {
          // param:...
          // fieldName:...
        }
      }
    }
  }
}
```

## Output

The following files will be generated into the `src/buildArtifacts` directory, which will allow them to be built along with other project resources. Please remember to add this directory toyour `.gitignore` file.

```
src
├── buildArtifacts
│   ├── adapterConfig.js
│   ├── mapping.js
│   ├── paths.js
│   └── settings.js
```
