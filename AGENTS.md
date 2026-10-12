# Project rules
- Normalize event photo data through a shared utility used by form, data mapping, and drawer; legacy string/JSON formats must not silently lose photos.
- Keep event photo rendering in a dedicated carousel component; form preview and public detail use the same behavior to prevent inconsistencies.