# Offline mobile video compression

Use this workflow for captioned guidance videos watched full-screen on modern iPhones. It produces a separate MP4 copy and leaves the source untouched.

## Final settings

| Setting | Value |
| --- | --- |
| Container | MP4 with `+faststart` |
| Video | HEVC / H.265 (`libx265`), Apple-compatible `hvc1` tag |
| Resolution | 1920 × 1080, retained from the source |
| Frame rate | 25 fps, retained from the source |
| Pixel format | `yuv420p` (8-bit SDR) |
| Encoder preset | `slower` |
| Rate control | Two-pass average bitrate, chosen for a file-size budget |
| Audio | AAC-LC, 96 kbps, stereo |
| Output suffix | `_mobile_1080p_hevc_small.mp4` |

This is lossy compression, not identical quality. Sample checks showed clear captions and small quality changes; moving grass, foliage and fine textures can soften. Test full-screen in the actual iPhone app before shipping. HEVC is less universally compatible than H.264, particularly outside modern Apple devices.

## 1. Install tools and inspect the source

On macOS:

```bash
brew install ffmpeg
ffmpeg -hide_banner -encoders | grep libx265
```

Always encode video from the original master, not an already compressed mobile copy.

```bash
ffprobe -v error \
  -show_entries stream=codec_type,codec_name,width,height,pix_fmt,avg_frame_rate,channels,color_transfer:format=duration,size \
  -of json "original.mp4"
```

The recipe below assumes a **1920 × 1080, 25 fps, SDR source with audio and burned-in captions**, like these guidance videos. It deliberately does not resize or change the frame rate. For other resolutions, frame rates or HDR footage, decide on scaling, frame-rate conversion or tone mapping first; the commands alone will not make those sources 1080p SDR. Separate subtitle tracks are not copied.

## 2. Choose a size budget

All sizes here use decimal MB: **1 MB = 1,000,000 bytes**.

For a collection that must stay below 100 MB, target **96 MB combined** to allow for encoder variation. Adding future videos means sharing that same budget across more content, or increasing the collection limit.

The video bitrate is calculated from the requested size, duration, 96 kbps audio and a 0.5% container allowance:

```text
video_kbps = floor((target_MB × 1,000,000 × 0.995 × 8 / duration_seconds − 96,000) / 1,000)
```

Do not give every video the same file size: longer or more detailed videos usually need more bytes. For the existing collection, budgets were proportional to the sizes of initial 1080p HEVC encodes made with `-preset slow -crf 28`. This gave more space to harder-to-compress videos. Those baseline encodes are optional for future files; choosing a budget directly also works.

## 3. Encode a new copy

Run this entire block in Bash from the folder containing the source. Change **`input`** and **`target_mb`** first. The 12 MB value is an example for one video, not a universal quality setting.

The first pass analyses the video; the second produces the output. Keep all video settings identical between passes. This can take several times the video's running time.

```bash
(
  set -e

  input="original.mp4"
  target_mb=12
  output="${input%.*}_mobile_1080p_hevc_small.mp4"

  test -f "$input" || { echo "Source file not found: $input" >&2; exit 1; }
  test ! -e "$output" || { echo "Refusing to overwrite: $output" >&2; exit 1; }

  duration=$(ffprobe -v error -show_entries format=duration \
    -of default=noprint_wrappers=1:nokey=1 "$input")

  video_kbps=$(awk -v mb="$target_mb" -v seconds="$duration" 'BEGIN {
    if (mb <= 0 || seconds <= 0) exit 1;
    rate = int((mb * 1000000 * 0.995 * 8 / seconds - 96000) / 1000);
    if (rate <= 0) exit 1;
    print rate;
  }')

  stats_dir=$(mktemp -d "${TMPDIR:-/tmp}/video-encode.XXXXXX")
  trap 'rm -rf -- "$stats_dir"' EXIT

  printf 'Target: %s MB; video bitrate: %s kbps\n' "$target_mb" "$video_kbps"

  ffmpeg -hide_banner -n -i "$input" \
    -map 0:v:0 -an \
    -c:v libx265 -preset slower -b:v "${video_kbps}k" -pix_fmt yuv420p \
    -x265-params "pass=1:stats=$stats_dir/pass.stats:log-level=error" \
    -f null -

  ffmpeg -hide_banner -n -i "$input" \
    -map 0:v:0 -map 0:a:0 \
    -c:v libx265 -preset slower -b:v "${video_kbps}k" -pix_fmt yuv420p \
    -x265-params "pass=2:stats=$stats_dir/pass.stats:log-level=error" \
    -tag:v hvc1 -c:a aac -b:a 96k -ac 2 \
    -map_metadata -1 -movflags +faststart "$output"

  # Decode every frame and the audio; stop on decoding errors.
  ffmpeg -hide_banner -v error -xerror -i "$output" -f null -

  bytes=$(wc -c < "$output")
  awk -v bytes="$bytes" 'BEGIN { printf "Output size: %.2f MB\n", bytes / 1000000; }'
)
```

`-n` prevents overwriting existing files. If an encode is interrupted, a partial output may remain; inspect it and remove or rename it before retrying.

For these five final files, the already-encoded 96 kbps stereo AAC was copied from the earlier mobile versions rather than encoded again. The recipe above encodes AAC directly from a new master, so it does not depend on an earlier mobile copy.

## 4. Validate before embedding

- Compare source and output duration, frame count and frame rate with `ffprobe`:

  ```bash
  ffprobe -v error \
    -show_entries stream=codec_type,codec_name,codec_tag_string,width,height,pix_fmt,avg_frame_rate,nb_frames,channels:format=duration,size \
    -of json "original_mobile_1080p_hevc_small.mp4"
  ```

- Confirm `hevc`, `hvc1`, 1920 × 1080, `yuv420p`, `25/1` and stereo AAC. Duration and video frame count should match the source.
- Compare motion-heavy scenes, fine detail and captions against the original at the same timestamps. Check audio and synchronisation too.
- Test offline playback, seeking and landscape full-screen viewing inside the actual iPhone application. Do not crop-to-fill if that cuts off captions.
- Measure actual sizes; two-pass encoding targets a budget but does not enforce an exact byte limit. If over budget, lower the requested size and re-encode from the original to a new filename.
- If quality is insufficient, increase the budget. A fixed resolution cannot guarantee unchanged quality at arbitrarily low bitrates.

To total only the final copies in the current folder:

```bash
find . -maxdepth 1 -type f -name '*_mobile_1080p_hevc_small.mp4' \
  -exec wc -c {} + | awk 'END { printf "Total: %.2f MB\n", $1 / 1000000; }'
```

## Reference: existing final collection

These are the actual two-pass video bitrate settings and measured output sizes. To reproduce the video settings, use the listed bitrate in both passes instead of the calculated `video_kbps`. Results can vary with encoder versions; these were made with FFmpeg 9.0.1.

| Video | Video bitrate | Final size |
| --- | ---: | ---: |
| 01 — What is E-Surveyor | 992 kbps | 10.39 MB |
| 02 — Setting Up Your Moth Trap | 1,633 kbps | 27.43 MB |
| 03 — Where To Place Your Moth Trap | 1,464 kbps | 16.12 MB |
| 04 — Recording moths in the morning | 1,279 kbps | 31.07 MB |
| 05 — Packing Away | 1,197 kbps | 10.76 MB |
| **Total (before rounding individual sizes)** | | **95.76 MB** |

All five passed full decoding, duration and frame-count checks. Three-second samples from each were also compared to their originals with VMAF and extracted frames were inspected. These checks do not replace full-screen testing on an iPhone.
