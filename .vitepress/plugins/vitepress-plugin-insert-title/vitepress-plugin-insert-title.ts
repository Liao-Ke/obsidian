import type { Plugin } from 'vite'
import { relative } from 'node:path'
import GrayMatter from 'gray-matter'
import {
  pathEndsWith,
  pathEquals,
  pathStartsWith,
} from './path'

export interface Context {
  helpers: {
    /**
     * A helper function to help to determine whether the passed string parameter equals the
     * current transforming module ID with normalization of paths capabilities and
     * cross platform / OS compatibilities.
     *
     * @param equalsWith - String to equal with
     * @returns boolean
     */
    idEquals: (equalsWith: string) => boolean
    /**
     * A helper function to help to determine whether the passed string parameter startsWith the
     * current transforming module ID with normalization of paths capabilities and
     * cross platform / OS compatibilities.
     *
     * @param startsWith - String to start with
     * @returns boolean
     */
    idStartsWith: (startsWith: string) => boolean
    /**
     * A helper function to help to determine whether the passed string parameter endsWith the
     * current transforming module ID with normalization of paths capabilities and
     * cross platform / OS compatibilities.
     *
     * @param endsWith - String to end with
     * @returns boolean
     */
    idEndsWith: (endsWith: string) => boolean
    /**
     * A helper function to help to determine whether the passed first path parameter
     * equals the second passed string with normalization of paths capabilities and
     * cross platform / OS compatibilities.
     *
     * @param path - Path to be compared with
     * @param equalsWith - String to equal with
     * @returns boolean
     */
    pathEquals: (path: string, equalsWith: string) => boolean
    /**
     * A helper function to help to determine whether the passed first path parameter
     * startsWith the second passed string with normalization of paths capabilities and
     * cross platform / OS compatibilities.
     *
     * @param path - Path to be compared with
     * @param startsWith - String to start with
     * @returns boolean
     */
    pathStartsWith: (path: string, startsWith: string) => boolean
    /**
     * A helper function to help to determine whether the passed first path parameter
     * endsWith the second passed string with normalization of paths capabilities and
     * cross platform / OS compatibilities.
     *
     * @param path - Path to be compared with
     * @param endsWith - String to end with
     * @returns boolean
     */
    pathEndsWith: (path: string, endsWith: string) => boolean
  }
}
export interface InsertTitleOptions {
  /**
   * The list of file names to exclude from the transformation
   *
   * @default ['index.md']
   */
  excludes?: string[]
  /**
   * The function to exclude the file from the transformation
   *
   * @param id - the current transforming module ID (comes from vite when transform hook is called)
   * @param context - the context object, contains several helper functions
   * @returns boolean
   * @default () => false
   */
  exclude?: (id: string, context: Context) => boolean
}

export function InsertTitle(options: InsertTitleOptions): Plugin {
  const {
    excludes = ['index.md'],
    exclude = () => false,
  } = options ?? {}

  let root = ''
  return {
    name: 'vitepress-plugin-insert-title',
    enforce: 'pre',
    configResolved(config) {
      root = config.root ?? ''
    },

    transform(code, id) {
      function idEndsWith(endsWith: string) {
        return pathEndsWith(relative(root, id), endsWith)
      }

      function idEquals(equals: string) {
        return pathEquals(relative(root, id), equals)
      }

      function idStartsWith(startsWith: string) {
        return pathStartsWith(relative(root, id), startsWith)
      }
      const context: Context = {
        helpers: {
          pathEndsWith,
          pathEquals,
          pathStartsWith,
          idEndsWith,
          idEquals,
          idStartsWith,
        },
      }
      if (!id.endsWith('.md'))
        return null
      if (excludes.includes(relative(root, id)))
        return null
      if (exclude(id, context))
        return null

      const parsedMarkdownContent = GrayMatter(code)
      const path = id
      const start = path.lastIndexOf('/') + 1;
      const end = path.lastIndexOf('.');
      const result = path.slice(start, end);

      return `# ${result}\n${parsedMarkdownContent.content}`
    }


  }

}