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

## Approach in V5

In V5 of the prefetch script, an assumption is made that we will be prefetching all content. This allows us to optimize the process, making the least amount of calls possible to Contentful, and also allows us to pre-calculate complex URLs for content items based on the `paths` config. If there are old or unused content types, use the `excludeTypes` property to exclude those from the prefetch.

## Configuration

The project is configured via the JSON syntaxed `.lastrevrc` file in the root of your project.

In order to get schema validation, either add the following property to the .lastrevrc file:

`"$schema":"https://raw.githubusercontent.com/last-rev-llc/lastrev-toolkit/master/packages/lastrev-build-prefetch-content/schemas/v5.schema.json"`

Or make sure you have the following settings in your .vscode file at the root of the project:

```json
{
  "files.associations": {
    ".lastrevrc": "json"
  },
  "json.schemas": [
    {
      "fileMatch": [".lastrevrc"],
      "url": "https://raw.githubusercontent.com/last-rev-llc/lastrev-toolkit/master/packages/lastrev-build-prefetch-content/schemas/v5.json"
    }
  ]
}
```

| Property                                  | Type                                 | Description                                                                                                                                                                              | Required | Default Value          |
| ----------------------------------------- | ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------------------- |
| useAdapter                                | boolean                              | Whether to use the adapter to transform the data fetched from contentful. If this is true, another property at the root of the file should be configured for the adapter config to use.  | No       | `false`                |
| excludeTypes                              | string[]                             | An array of content types to exclude from all prefetching.                                                                                                                               | No       | `[]`                   |
| writeMappings                             | boolean                              | Whether to write the component mappings file.                                                                                                                                            | No       | `false`                |
| writeSettings                             | boolean                              | Whether to write the settings file.                                                                                                                                                      | No       | `false`                |
| writeAdapterConfig                        | boolean                              | Whether to write the adapter config file.                                                                                                                                                | No       | `false`                |
| writePaths                                | boolean                              | Whether to write the paths file.                                                                                                                                                         | No       | `false`                |
| writeContentJson                          | boolen                               | Whether or not to write JSON files for the content to be used to render the pages.                                                                                                       | No       | `false`                |
| writeLocaleData                           | boolean                              | Whether to write the i18n.json and locale lookup files.                                                                                                                                  | No       | `false`                |
| settings                                  | object                               | the levels of depth to grab in the GlobalSettings object.                                                                                                                                | No       |                        |
| mappings                                  | object                               | Configure the component mapper. See below.                                                                                                                                               | No       |                        |
| mappings.overrides                        | { [contentTypeId: string]: string }  | Key value pair of content type id to component name, overriding the default pascalCase lookup of component.                                                                              | No       | `{}`                   |
| mappings.exclude                          | string[]                             | An array of component names to exclude form the mappings. This is useful to avoid circular dependencies, which will break storybook functionality.                                       | No       | `[]`                   |
| locales                                   | object                               | Configure the locales data writer. See below.                                                                                                                                            | No       |                        |
| locales.localizationLookupFieldName       | string                               | The name of the localizationLookup field in the global settings object .                                                                                                                 | No       | `'localizationLookup'` |
| contentJson                               | { [contentTypeId: string]: object }  | A configuration object keyed by content type.                                                                                                                                            | No       | `{}`                   |
| contentJson.{contentType}.slugField       | string                               | the name of the field used for the slug of this content type.                                                                                                                            | No       | `'sys.id'`             |
| contentJson.{contentType}.include         | number                               | The depth to which nested referenced entries are expanded.                                                                                                                               | No       | `1`                    |
| contentJson.{contentType}.rootOmitFields  | string[]                             | An array of field names to omit from the page object at the root level.                                                                                                                  | No       | `[]`                   |
| contentJson.{contentType}.childOmitFields | string[]                             | An array of field names to omit from nested entries at all child levels.                                                                                                                 | No       | `[]`                   |
| paths                                     | object                               | An object, described below, configuring how to write the paths                                                                                                                           | No       | `{}`                   |
| paths.type                                | 'Nested Children' or 'Nested Parent' | How the nesting is arranged. Nested Children will build an object based on child items of a parent property, nested parent will build a hierarchy based on a parent field of the object. | No       | `'Nested Children'`    |
| paths.config                              | object                               | see examples below for how to configure these obejcts                                                                                                                                    | No       | {}                     |

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
      "type": "Nested Children",
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
    "mappings": {
      "exclude": ["PageGeneral"],
      "overrides": {
        "settingsGlobal": "Layout",
        "globalFooter": "Footer"
      }
    },
    "contentJson": {
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

Paths can be one of two types, "Nested Children" or "Nested Parent".
These two paths are confgiured and built differently.

**Nested Children**
NOTE: This is not the recommended approach, see "Nested Parent" below for the recommended approach.

Nested children type paths are configured as below. Each item under `config` represents one group of paths, keyed off of the key in the object. As a shorthand, a string configuration will assume the key to be the contentTypeId and the value to be the param name.

Each children object can have a nested children object within it.

```json
{
  "paths": {
    "type": "Nested Children",
    "config": {
      "nestedPageRecipeStep": {
        "param": "slug",
        "contentType": "recipe",
        "children": {
          "param": "stepslug",
          "fieldName": "steps"
        }
      }
    }
  }
}

// this shorthand:
{
  "paths": {
    "type": "Nested Children",
    "config": {
      "pageGeneral": "slug"
    }
  }
}

// is the same as
{
  "paths": {
    "type": "Nested Children",
    "config": {
      "pageGeneral": {
        "param": "slug",
        "contentType": "pageGeneral"
      }
    }
  }
}
```

The output of the above configuration is an object that looks like this:

```json
{
  "nestedPageRecipeStep": [
    {
      "params": {
        "slug": "my-recipe-1",
        "stepslug": "my-recipe-1-step-1"
      }
    },
    {
      "params": {
        "slug": "my-recipe-1",
        "stepslug": "my-recipe-1-step-2"
      }
    },
    {
      "params": {
        "slug": "my-recipe-2",
        "stepslug": "my-recipe-2-step-1"
      }
    }
  ]
}
```

This is intended for single slug style configuration in next.js, like this:

```
/
├── /recipes
│   ├── [slug].js
│   │   ├── [stepslug].js
│   │   └── index.js
└── index.js
```

**Nested Parent**

Nested parent type paths are configured as below. Each item under `config` represents one content type, and how that type is rendered. `fieldName` will be the field in which the "slug" is located, generally this will be `slug`. `paramName` will be the paramName to output to both the paths file as well as to the generated URLs for each content item (see below). `root` is the root for the generated URLs. `parentField` represents a field name of a reference field containing parent content items which the current one is nested below. `maxDepth` represents how far up the hierarchy to builkd before stopping. This can help stop endless loops.

if an item is found in the parentField, the contentType of that item is scanned in the paths config to determine the `slug` and possible `parentField` of that item, etc.

```json
{
  "paths": {
    "type": "Nested Parent",
    "config": {
      "pageAccelerator": {
        "maxDepth": 3,
        "fieldName": "slug",
        "paramName": "slug",
        "root": "/accelerators"
      },
      "pagePost": {
        "fieldName": "slug",
        "parentField": "categoryPostColType",
        "root": "/the-line"
      },
      "categoryPostColumnType": {
        "fieldName": "slug",
        "root": "/the-line"
      }
    }
  }
}
```

The output of the above configuration is an object that looks like this:

```json
{
  "pageAccelerator": [
    {
      "params": {
        "slug": ["accelerator-1"]
      }
    },
    {
      "params": {
        "slug": ["accelerator-2"]
      }
    }
  ],
  "categoryPostColumnType": [
    {
      "params": {
        "slug": ["post-type-1"]
      }
    },
    {
      "params": {
        "slug": ["post-type-2"]
      }
    }
  ],
  "pagePost": [
    {
      "params": {
        "slug": ["post-type-1", "post-1"]
      }
    },
    {
      "params": {
        "slug": ["post-type-1", "post-2"]
      }
    },
    {
      "params": {
        "slug": ["post-type-2", "post-3"]
      }
    },
    {
      "params": {
        "slug": ["post-type-2", "post-4"]
      }
    }
  ]
}
```

This is intended for multiple slug style configuration in next.js, like this:

```
/
├── /accelerators
│   ├── [...slug].js
│   └── index.js
├── /the-line
│   ├── [...slug].js
│   └── index.js
└── index.js
```

In the above scenbario, "the-line" can have one of two levels below it, where the category would be the first level, and the post would be the second level.

In addition to being more flexible, the Nested Parent approach is also tied in with content prefetch, and the URLs are generated prior to passing objects through the adapter. The content to URL mapping is passed along to the adapter to help generate the correct `_href` and `_as` properties.

For one of the pagePost items shown above, these would be the `_href` and `_as` properties:

```js
{
  _href: '/the-line/[...slug]',
  _as: '/the-line/post-type-2/post-3'
}
```

## Output

The following files will be generated into the `src/buildArtifacts` directory, which will allow them to be built along with other project resources. Please remember to add this directory toyour `.gitignore` file.

```
src
├── buildArtifacts
│   ├── contentJson
│   │   ├── en-US
│   │   │   ├── slug-1.js
│   │   │   └── slug-2.js
│   │   └── sp
│   │       ├── slug-1.js
│   │       └── slug-2.js
│   ├── adapterConfig.js
│   ├── mapping.js
│   ├── paths.js
│   └── settings.js
```
