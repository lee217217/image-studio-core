# Asset Licenses

## Stickers (`src/editor/stickerPacks/`)

All sticker SVG artwork in this directory is **original work created for Image
Studio Core** and is licensed under the **MIT License** alongside the rest of
this codebase.

We deliberately did **not** vendor any third-party emoji sets to keep the
project's licensing simple and the bundle small.

### Compatible alternatives (not used here)

If you wish to swap in third-party emoji artwork, the following sets are
license-compatible with a project of this kind:

| Set            | License     | URL                                          |
| -------------- | ----------- | -------------------------------------------- |
| Twemoji        | CC-BY 4.0   | https://github.com/twitter/twemoji           |
| OpenMoji       | CC BY-SA 4.0| https://openmoji.org                         |
| Fluent Emoji   | MIT         | https://github.com/microsoft/fluentui-emoji  |
| Phosphor Icons | MIT         | https://phosphoricons.com                    |
| Lucide         | ISC         | https://lucide.dev                           |

To swap a sticker pack to one of these sets, replace the `svg` string in
`heartsPack.js` / `animalsPack.js` / etc with the SVG string from the target
set. Each sticker entry already has a stable `id`, so consumers of the API
are unaffected.

### Trademarks & copyrighted characters

We **do not** include any copyrighted characters (Disney, brand mascots,
specific company logos, etc.). Animal stickers are generic species
representations, not branded characters.
