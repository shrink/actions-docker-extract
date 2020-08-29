# Docker Extract

A GitHub Action for extracting files from a Docker Image.

```yaml
- uses: shrink/actions-docker-extract@v1
  with:
    image: 'docker.pkg.github.com/github/semantic/semantic'
    path: '/etc/motd'
```

## Inputs

All inputs are required.

| ID  | Description | Example |
| --- | ----------- | ------- |
| `image` | Docker Image to extract files from | `alpine` |
| `path` | Path (from root) to a file or directory within Image | `/etc/motd` |

## Outputs

| ID  | Description | Example |
| --- | ----------- | ------- |
| `destination` | Destination path containing the extracted file(s) | `.extracted-1598717412` |

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
      - uses: actions/checkout@v2
      - name: Build Docker Image
        uses: docker/build-push-action@v1
        with:
          repository: my-example-image
          tags: latest
      - uses: shrink/actions-docker-extract@v1
        with:
          image: my-example-image
          path: /app
      - name: Upload Dist
        uses: actions/upload-artifact@v2
        with:
          path: ${{ steps.extract.outputs.destination }}/app
          name: dist
```

### Login, Pull, Extract

Using [docker/login-action][login-action] to authenticate with the GitHub
Package Registry to extract from a published Docker Image.

```yaml
jobs:
  extract:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Login to GitHub Package Registry
        uses: docker/login-action@v1
        with:
          registry: docker.pkg.github.com
          username: ${{ github.repository_owner }}
          password: ${{ github.token }}
      - uses: shrink/actions-docker-extract@v1
        with:
          image: ${{ github.repository }}/example-image:latest
          path: /app
      - name: Upload Dist
        uses: actions/upload-artifact@v2
        with:
          path: ${{ steps.extract.outputs.destination }}/app
          name: dist
```

[build-push-action]: https://github.com/docker/build-push-action
[login-action]: https://github.com/docker/login-action
