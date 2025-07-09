# Docker Extract

A GitHub Action for extracting files from a Docker Image.

```yaml
- uses: shrink/actions-docker-extract@v3
  with:
    image: "ghost:alpine"
    path: "/var/lib/ghost/current/core/built/assets/."
```

:warning: Due to a breaking change in v3 of GitHub's actions/upload-artifact, a
low-impact breaking change has been made to v3.0.1 of this action. Please
see [issues#28](https://github.com/shrink/actions-docker-extract/issues/28) for
context and support.

## Inputs

| ID            | Description                                          | Required | Examples                                      |
| ------------- | ---------------------------------------------------- | :------: | --------------------------------------------- |
| `image`       | Docker Image to extract files from                   |    ✅    | `alpine` `ghcr.io/github/super-linter:latest` |
| `path`        | Path (from root) to a file or directory within Image |    ✅    | `files/example.txt` `files` `files/.`         |
| `destination` | Destination path for the extracted files             |    ❌    | `/foo/` `~/` `./foo/bar`                      |
| `shell`       | The shell to use for extraction                      |    ❌    | `/bin/bash` `/bin/sh`                         |

> :paperclip: To copy the **contents** of a directory the `path` must end with
> `/.` otherwise the directory itself will be copied. More information about the
> specific rules can be found via the [docker cp][docker-cp] documentation.

## Outputs

| ID            | Description                                       | Example                  |
| ------------- | ------------------------------------------------- | ------------------------ |
| `destination` | Destination path containing the extracted file(s) | `extracted-1598717412/` |

## Examples

### Build, Extract

Using [docker/build-push-action][build-push-action] to build a Docker
Image and then extract the contents of the `/app` directory within the newly
built image to upload as a `dist` artifact.

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build Docker Image
        uses: docker/build-push-action@v5
        with:
          tags: my-example-image:latest
          load: true
      - uses: shrink/actions-docker-extract@v3
        id: extract
        with:
          image: my-example-image:latest
          path: /app/.
          destination: dist
      - name: Upload Dist
        uses: actions/upload-artifact@v3
        with:
          path: dist
```

### Login, Pull, Extract

Using [docker/login-action][login-action] to authenticate with the GitHub
Container Registry to extract from a published Docker Image.

```yaml
jobs:
  extract:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Login to GitHub Container Registry
        uses: docker/login-action@v2
        with:
          registry: "ghcr.io"
          username: "${{ github.actor }}"
          password: "${{ secrets.GITHUB_TOKEN }}"
      - uses: shrink/actions-docker-extract@v3
        id: extract
        with:
          image: ghcr.io/${{ github.repository }}:latest
          path: /app/.
          destination: dist
      - name: Upload Dist
        uses: actions/upload-artifact@v3
        with:
          path: dist
```

## Automatic Release Packaging

A Workflow packages the Action automatically when a collaborator created a new
tag. Any reference to this Action in a Workflow must use a [tag][tags] (mutable)
or the commit hash of a tag (immutable).

```yaml
✅ uses: shrink/actions-docker-extract@v3
✅ uses: shrink/actions-docker-extract@v3.0.0
✅ uses: shrink/actions-docker-extract@40400b42f4f8b663c647f535e2c6674658e39fc6
❌ uses: shrink/actions-docker-extract@main
```

The blog post
[Package GitHub Actions automatically with GitHub Actions][blog/package-automatically]
describes how this is achieved.

[build-push-action]: https://github.com/docker/build-push-action
[login-action]: https://github.com/docker/login-action
[docker-cp]: https://docs.docker.com/engine/reference/commandline/cp/#extended-description
[tags]: https://github.com/shrink/actions-docker-extract/tags
[blog/package-automatically]: https://medium.com/prompt/package-github-actions-automatically-with-github-actions-a70b9f7bae4
