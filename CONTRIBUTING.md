# Contributing

> [!IMPORTANT]
> Using AI is allowed, but remember that it is a tool, not a developer.
> Please make sure all code works by previewing the website, fixing inconsistent styles,
> and removing redundant functions and comments!

## Common commands

```sh
# Preview the website with live reload
hugo server

# Preview the website with access to Netlify serverless functions
netlify dev -c "hugo server -w" --target-port 1313
```

## Guides

- [MDN Web Docs](https://developer.mozilla.org), for HTML, CSS, and JavaScript

### Hugo

Hugo is a static site generator (SSG), meaning the website content is built directly into
HTML, not fetched dynamically from a database. This provides a simple backend and fast
performance, perfect for a small website. Read
[more about SSGs from Cloudflare](https://www.cloudflare.com/learning/performance/static-site-generator).

- [Homepage](https://gohugo.io)
- [Documentation](https://gohugo.io/documentation)

The main content is in `src/content`. It is written in Markdown, a simple and readable markup
language that's quick and easy to learn. It's possible to also use HTML tags in Markdown.

Many edits to the website content can be done without ever touching the underlying HTML templates!

- [Markdown Guide](https://www.markdownguide.org), a guide to Markdown
- [Hugo front matter](https://gohugo.io/content-management/front-matter)
- [Hugo page resources](https://gohugo.io/content-management/page-resources), for images

Hugo uses HTML templates in `src/layouts`. Go templates are denoted by the `{{  }}` syntax.
Special templates called shortcodes can be used in Markdown content.

- [Template types](https://gohugo.io/templates/types)
- [Shortcodes](https://gohugo.io/content-management/shortcodes)
- [New template system in Hugo v0.146.0](https://gohugo.io/templates/new-templatesystem-overview)
- [Go template functions](https://gohugo.io/functions)

This website was built on the [Dot-Org Hugo theme](https://github.com/cncf/dot-org-hugo-theme).
Many files have been heavily modified or removed, but most of its shortcodes are still used.

### Sass

Sass is a CSS preprocessor that provides nesting, functions, etc. Basically, it makes CSS easier
to write.

The files are in `src/assets/scss`.

Hugo is configured to use **Dart Sass** to compile Sass into CSS. Other implementations like
LibSass are not guaranteed to be up to date with features!

- [Homepage](https://sass-lang.com)
- [Sass Basics](https://sass-lang.com/guide)
- [Documentation](https://sass-lang.com/documentation)

### TypeScript

TypeScript is a superset of JavaScript that allows static type checking. It helps to spot
errors and prevent bugs.

The files are in `src/assets/ts`.

- [Homepage](https://www.typescriptlang.org)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

### Netlify

Netlify hosts the static website for free.

It builds the website from the GitHub repository, which is automated with GitHub Actions, and
fetches dependencies specified in `netlify.toml`.

It provides the environment variable for the Google Calendar API key (generated in Google Cloud)
that fetches the JSON data for the Events page. This is implemented through a serverless function
in `src/netlify`.

- [Homepage](https://www.netlify.com)
- [Intro to Serverless Functions](https://www.netlify.com/blog/intro-to-serverless-functions)
