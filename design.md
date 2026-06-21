# ATRIA Design System — "Corporate Tech · Refined Navy"

> Quy tắc thiết kế UI để áp dụng cho dự án **React + TailwindCSS**.
> Đọc kỹ và TUÂN THỦ TUYỆT ĐỐI. Đây là hệ thống dùng cho công cụ nội bộ doanh nghiệp (HRM, dashboard, bảng dữ liệu lớn) — KHÔNG phải landing page hay consumer app.

---

## 0 · TRIẾT LÝ CỐT LÕI (đọc trước khi code bất cứ gì)

Giao diện này theo trường phái **dense, professional, data-first** — lấy cảm hứng từ **Stripe Dashboard, Linear, Vercel, Ramp**. KHÔNG lấy cảm hứng từ Bootstrap, Material Design, hay các template AI thông thường.

5 nguyên tắc bất biến:

1. **Density có chủ đích** — Không phải càng nhiều whitespace càng đẹp. Người dùng (HR, kế toán) cần thấy nhiều dữ liệu cùng lúc. Padding vừa phải, không phóng đại.
2. **Type-driven hierarchy** — Dẫn mắt bằng _size_ + _weight_ + _color_ của chữ, KHÔNG bằng border dày hay box lồng nhau. Hạn chế tối đa đường viền.
3. **Numbers as heroes** — Mọi con số (tiền, ngày, %, ID, mã) PHẢI render bằng **font mono (JetBrains Mono)** với `tabular-nums`. Số tiền lớn render to, đậm.
4. **Restrained color** — 90% giao diện là **navy + xám + trắng**. Màu (amber/green/red/blue) CHỈ dùng cho status & action, KHÔNG trang trí.
5. **Sharp, not bubbly** — Radius nhỏ (6–8px). Shadow cực nhẹ. KHÔNG bo tròn 16px+, KHÔNG shadow lớn, KHÔNG gradient trang trí.

### ❌ TUYỆT ĐỐI TRÁNH (anti-patterns)

- Gradient tím-hồng / cầu vồng trên nền — dấu hiệu "AI slop"
- Font Inter, Roboto, Arial, system-ui làm font chính
- Card bo tròn ≥ 16px với drop-shadow lớn (trông "consumer app")
- Emoji trong UI nghiệp vụ (chỉ chấp nhận trong empty state / greeting cá nhân)
- Glassmorphism, backdrop-blur trang trí
- Icon line mảnh 1px, size 24px+ trong UI dày đặc
- Màu thuần để trang trí (vd nền tím cho card chỉ vì đẹp)
- Border ở mọi nơi — dùng khoảng cách + nền thay vì viền khi có thể

---

## 1 · MÀU SẮC (Color Tokens)

Đưa toàn bộ vào `tailwind.config` qua CSS variables. KHÔNG hardcode hex trong component.

### 1.1 CSS Variables (`globals.css` → `:root`)

```css
:root {
  /* NAVY — màu thương hiệu, dùng nhiều nhất */
  --navy-950: #061224; /* nền sidebar, bề mặt sâu nhất */
  --navy-900: #0b1f3d; /* pressed state, section tối */
  --navy-800: #142b52; /* hover của primary button */
  --navy-700: #1e3a6b; /* ★ PRIMARY: nền button, nav active, link đậm */
  --navy-600: #2b4a85; /* hover trên nền sáng */
  --navy-500: #3b5ba0; /* link trên nền sáng */
  --navy-300: #8fa4c7; /* element brand bị disable */
  --navy-100: #dce4f2; /* nền hàng được chọn, soft brand bg */
  --navy-50: #f0f4fa; /* nền brand-tinted rất nhạt */

  /* NEUTRALS — xám */
  --white: #ffffff;
  --gray-50: #f7f8fa; /* ★ nền trang chính */
  --gray-100: #eef0f4; /* nền section nhẹ, hover row */
  --gray-200: #e1e5ec; /* ★ border mặc định */
  --gray-300: #c7cdd8; /* border đậm, border disabled */
  --gray-400: #98a1b2; /* text cấp 3, icon mặc định */
  --gray-500: #6b7588; /* ★ text phụ (secondary) */
  --gray-700: #3a4456; /* text body trên nền sáng */
  --gray-900: #0f172a; /* ★ text chính, heading */

  /* ACCENT (amber) — DÙNG TIẾT KIỆM: tối đa 1 nút accent/màn hình */
  --accent-700: #b45309; /* pressed */
  --accent-600: #d97706; /* ★ CTA quan trọng nhất: "Tạo mới", "Phê duyệt" */
  --accent-500: #f59e0b; /* hover / highlight nhỏ */
  --accent-100: #fef3c7; /* nền badge accent */
  --accent-50: #fffbeb; /* highlight cực nhạt */

  /* SEMANTIC — chỉ cho status & feedback */
  --success-700: #15803d;
  --success-600: #16a34a;
  --success-100: #dcfce7;
  --success-50: #f0fdf4;
  --warning-700: #a16207;
  --warning-600: #ca8a04;
  --warning-100: #fef9c3;
  --warning-50: #fefce8;
  --danger-700: #b91c1c;
  --danger-600: #dc2626;
  --danger-100: #fee2e2;
  --danger-50: #fef2f2;
  --info-700: #1d4ed8;
  --info-600: #2563eb;
  --info-100: #dbeafe;
  --info-50: #eff6ff;

  /* SHADOWS — cực kỳ nhẹ, layered */
  --shadow-xs: 0 1px 2px rgba(15, 23, 42, 0.04);
  --shadow-sm: 0 2px 4px rgba(15, 23, 42, 0.06);
  --shadow-md: 0 4px 12px rgba(15, 23, 42, 0.08);
  --shadow-lg: 0 12px 24px rgba(15, 23, 42, 0.1);
  --shadow-xl: 0 24px 48px rgba(15, 23, 42, 0.12);
  --focus-ring: 0 0 0 3px rgba(30, 58, 107, 0.2);

  /* RADII */
  --r-sm: 4px; /* badge, chip nhỏ */
  --r-md: 6px; /* ★ button, input, cell */
  --r-lg: 8px; /* ★ card */
  --r-xl: 12px; /* modal, container lớn */
  --r-pill: 999px; /* avatar, pill */
}
```

### 1.2 Quy tắc dùng màu

| Vai trò                                  | Token                                       |
| ---------------------------------------- | ------------------------------------------- |
| Nền trang                                | `gray-50`                                   |
| Nền card / panel / bề mặt                | `white`                                     |
| Nền sidebar                              | `navy-950`                                  |
| Text heading / số liệu                   | `gray-900`                                  |
| Text body                                | `gray-700`                                  |
| Text phụ / label                         | `gray-500`                                  |
| Text cấp 3 / placeholder / icon mặc định | `gray-400`                                  |
| Border mặc định                          | `gray-200`                                  |
| Border hover / đậm                       | `gray-300` → `gray-400`                     |
| Nút primary                              | nền `navy-700`, hover `navy-800`, chữ trắng |
| Nút CTA tối quan trọng (1/màn)           | nền `accent-600`, hover `accent-700`        |
| Hàng table được chọn                     | nền `navy-50` + border-left 3px `navy-700`  |
| Hàng table hover                         | nền `gray-50`                               |

### 1.3 Badge / status — cặp màu cố định (bg + text)

```
neutral : bg gray-100    + text gray-700
brand   : bg navy-100    + text navy-700
success : bg success-100 + text success-700   (Đã duyệt, Hoàn thành, Active)
warning : bg warning-100 + text warning-700   (Chờ xử lý, Sắp hết hạn)
danger  : bg danger-100  + text danger-700    (Từ chối, Quá hạn, Khoá)
info    : bg info-100     + text info-700      (Đang xử lý)
accent  : bg accent-100  + text accent-700    (Mới, Highlight)
```

Badge có thể kèm 1 chấm tròn 6px cùng màu text bên trái để rõ hơn.

---

## 2 · TYPOGRAPHY

### 2.1 Fonts (BẮT BUỘC — không thay thế)

- **Plus Jakarta Sans** (400/500/600/700/800) — toàn bộ display + body. Humanist-geometric, hỗ trợ tiếng Việt tốt, KHÔNG generic như Inter.
- **JetBrains Mono** (400/500/600) — TẤT CẢ con số tabular: tiền, ngày, ID, mã NV, %, giờ.

Load qua `next/font` hoặc `@fontsource`, expose thành:

```css
--font-jakarta: "Plus Jakarta Sans", sans-serif;
--font-mono: "JetBrains Mono", monospace;
```

Tailwind: `font-sans` = jakarta, `font-mono` = jetbrains.

### 2.2 Type scale

| Tên        | Size / Line-height | Weight     | Dùng cho                                                    |
| ---------- | ------------------ | ---------- | ----------------------------------------------------------- |
| display-xl | 48/52              | 700        | Hero number KPI                                             |
| display-lg | 36/40              | 700        | Page title lớn                                              |
| display-md | 30/36              | 600        | Section title                                               |
| h1         | 24/32              | 600        | ★ Page title mặc định                                       |
| h2         | 20/28              | 600        | Card title, modal title                                     |
| h3         | 18/24              | 600        | Subsection                                                  |
| h4         | 16/24              | 600        | Component title                                             |
| body-lg    | 16/24              | 400        | Long-form                                                   |
| **body**   | **14/20**          | **400**    | ★ MẶC ĐỊNH — body 14px KHÔNG phải 16px                      |
| body-sm    | 13/18              | 400        | Thông tin phụ                                               |
| caption    | 12/16              | 500        | Label, badge                                                |
| overline   | 11/16              | 600        | Eyebrow — UPPERCASE + letter-spacing .06em + color gray-500 |
| numeric-xl | 32/36              | 600 (mono) | Lương, big number                                           |
| numeric-md | 18/24              | 500 (mono) | Số trong bảng                                               |
| numeric-sm | 14/20              | 500 (mono) | Số nhỏ, ID                                                  |

### 2.3 Quy tắc chữ

- Body mặc định **14px** (dense UI). KHÔNG dùng 16px làm mặc định.
- Heading (h1–h3): thêm `letter-spacing: -0.01em` (đôi khi -0.02em cho số lớn) để siết gọn.
- Overline: LUÔN `text-transform: uppercase`, `letter-spacing: 0.06em`, `color: gray-500`, size 10–11px, weight 600. Dùng làm nhãn nhóm/section/KPI label.
- Số tiền/ngày/ID/% : LUÔN `font-mono` + `tabular-nums` (Tailwind: `font-mono tabular-nums`). Ví dụ `1.840.500.000 ₫` — format theo `toLocaleString('vi-VN')`.
- `text-wrap: pretty` cho đoạn văn dài.

---

## 3 · SPACING & LAYOUT

### 3.1 Spacing scale (base 4px)

`0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96` (px)

- Gap mặc định giữa element: **16px**
- Padding trong card: **20–24px**
- Padding ngang main content: **32px** (desktop)
- Gap giữa label và input: **6px**; giữa các field: **16–20px**
- Gap giữa các section trong page: **20–24px**

### 3.2 App Shell (layout chuẩn cho tool nội bộ)

```
┌─────────┬──────────────────────────────────┐
│ Sidebar │ Topbar (h 64px, bg white)        │
│ 220-    ├──────────────────────────────────┤
│ 256px   │ Main content (bg gray-50,        │
│ navy-950│   padding 24-32px, scroll)       │
└─────────┴──────────────────────────────────┘
```

**Sidebar (`navy-950`):**

- Logo block trên cùng (h 64px): logo mark vuông 28px bo `r-md` + wordmark 14–16px weight 700 trắng + role label nhỏ bên dưới (overline, màu `accent-500`).
- Nav nhóm theo section: eyebrow label (overline, `rgba(255,255,255,.28)`) + các item.
- Nav item: height 38–40px, padding `0 20px`, gap 10px, icon 18–20px + label 13–14px weight 500.
  - text mặc định `rgba(255,255,255,.65)`
  - hover: bg `rgba(255,255,255,.04)`, text trắng
  - **active: bg `navy-700` + border-left 3px `accent-500` + text trắng**
  - badge số (vd đơn chờ): pill bg `accent-600`, text trắng, 11px.
- Footer: avatar 24px + tên + role nhỏ, divider trên.

**Topbar (`white`, border-bottom `gray-200`, h 64px, padding `0 32px`):**

- Trái: breadcrumb dạng text (`gray-500`, current `gray-900` weight 500, separator `/` màu `gray-300`).
- Giữa (tùy chọn): search bar global width ~260-360px, bg `gray-50`, border trong suốt, icon search 14px, hint "Ctrl K".
- Phải: icon button Help + Notification (chấm đỏ nếu có), divider dọc, avatar 24px + tên ngắn + chevron.

### 3.3 Page templates

- **Dashboard**: 4 KPI cards hàng trên (grid 4 cột, gap 16) → 2 cột content (vd 7/5 hoặc 8/4) → bảng/list full-width.
- **List/Table**: page header → toolbar (search + filter chips) → table full-width → pagination.
- **Detail**: header banner (bg `navy-50`) → tabs underline → nội dung tab.
- **Form**: single column max-width **720px** ở giữa, chia section bằng card.
- **2-col approval / master-detail**: list trái (~380px) + detail phải (fluid).

---

## 4 · COMPONENTS

### 4.1 Button

3 size: `sm` h32 / `md` h40 (mặc định) / `lg` h48. Radius `r-md`. Font weight 500–600. Gap icon-text 7-8px. `transition: background 150ms`. Active: `scale(0.98)`. Focus: `box-shadow: var(--focus-ring)`.

| Variant      | Nền         | Text       | Border            | Hover                       | Dùng                               |
| ------------ | ----------- | ---------- | ----------------- | --------------------------- | ---------------------------------- |
| primary      | navy-700    | white      | none              | navy-800                    | action chính                       |
| accent       | accent-600  | white      | none              | accent-700                  | CTA tối quan trọng — **max 1/màn** |
| secondary    | white       | gray-900   | 1px gray-300      | bg gray-50, border gray-400 | action phụ                         |
| ghost        | transparent | gray-700   | none/1px gray-200 | bg gray-100                 | toolbar, row action                |
| link         | transparent | accent-600 | none              | underline                   | inline                             |
| danger       | danger-600  | white      | none              | danger-700                  | xoá, từ chối                       |
| danger-ghost | transparent | danger-600 | 1px danger-100    | bg danger-50                | xoá nhẹ trong table                |

- Disabled: `opacity .5`, `cursor: not-allowed`.
- Loading: spinner 14px thay icon, text giữ nguyên, disabled.
- Icon button (vuông): 32/40/48px tương ứng size.

### 4.2 Input / Form

- Height 40px (md), padding `0 12px`, font 14px, border 1px `gray-300`, radius `r-md`, bg white.
- Placeholder `gray-400`.
- Hover: border `gray-400`. **Focus: border `navy-600` + `box-shadow: var(--focus-ring)`**.
- Error: border `danger-600`, helper text `danger-600` bên dưới (12px, margin-top 6px).
- Disabled: bg `gray-100`, text `gray-400`.
- Label: 13px weight 500, `gray-700`, margin-bottom 6px. Required: dấu `*` màu `danger-600`.
- Có thể có icon slot trái/phải (icon `gray-400` 16px).
- Select: như input + chevron 16px phải. Panel dropdown: bg white, `shadow-md`, radius `r-md`, item h36, hover bg `gray-100`, selected bg `navy-50` + check.
- Checkbox/Radio: 16px, border `gray-400` 1.5px, checked bg `navy-700`. `accent-color: var(--navy-700)`.
- Toggle: w36 h20 pill, off bg `gray-300`, on bg `success-600`, knob trắng 16px trượt 150ms.

### 4.3 Card

- Bg white, **border 1px `gray-200`**, radius `r-lg` (8px), padding 20–24px.
- **KHÔNG shadow mặc định** — chỉ border. Nếu interactive (clickable): hover thêm `shadow-sm`.
- Cấu trúc: header (title h4 + actions, border-bottom `gray-200`, mb 16px) → body → footer (border-top, action buttons).
- **StatCard (KPI)**: padding 20px. Layout: overline label trên → số `numeric-xl` (32px mono) giữa → trend indicator dưới (icon arrow 12px + delta `+12%` màu success/danger + text so sánh `gray-500`). Có thể kèm sparkline mini (80×32px) bên phải.

### 4.4 Table (DataGrid) — component QUAN TRỌNG nhất

- Header row: bg `gray-50`, h44px, padding `0 12-16px`, font 11px weight 600-700 UPPERCASE tracking .04em color `gray-400`. Sort icon nhỏ bên phải nếu sortable.
- Body row: h52-56px (md) hoặc 48px (compact), font 13-14px.
- **Border chỉ ngang** (1px `gray-100` hoặc `gray-200`), KHÔNG có border dọc.
- Hover row: bg `gray-50`. Selected row: bg `navy-50` + border-left 3px `navy-700`.
- Cột số/tiền: **align right, font-mono, tabular-nums**. Số âm/khấu trừ màu `danger-600`.
- Cột tên người: avatar 24-28px + tên (weight 500) + email nhỏ (gray-500) — 2 dòng.
- Cột status: dùng Badge.
- Cột action: icon button 3-dot `MoreHorizontal` → dropdown menu.
- Row cảnh báo (vd HĐ sắp hết hạn): bg `warning-50` nhẹ + icon AlertCircle.
- Totals row (nếu có): bg `navy-50`, border-top 2px `navy-100`, font-mono weight 700.
- Sticky header khi scroll dọc.
- Pagination dưới: "Hiển thị X / Y", dropdown "N dòng/trang", prev/next + số trang.

### 4.5 Badge / Pill

- Size sm: padding `2px 6px` font 11px; md: padding `3-4px 8-10px` font 12px. Radius `r-sm`. Weight 500.
- 7 variant như mục 1.3. Optional dot 6px bên trái.

### 4.6 Avatar

- Sizes: xs 20 / sm 24 / md 32 / lg 40 / xl 64px. Radius pill (tròn). Border 1px `gray-200`.
- Fallback: initials (2 ký tự) + nền màu **hash từ tên** (consistent). 6 màu hash: `#1E3A6B, #0891B2, #7C3AED, #0D9488, #BE185D, #A16207`. Text trắng weight 600.
- AvatarGroup: stack overlap -8px, ring trắng 2px, max 3 + badge "+N".

### 4.7 Tabs

- **Underline (mặc định)**: border-bottom 1px `gray-200` toàn dải. Tab item padding `12px 16px`, font 14px weight 500, color `gray-500`. Active: color `gray-900`, border-bottom 2px `navy-700`, margin-bottom -1px. Có thể kèm count badge.
- **Pill (filter nhỏ)**: bg `gray-100`, padding 3px, radius `r-md`. Item padding `6px 12px`, radius `r-sm`, font 12-13px. Active: bg white + `shadow-xs` + color `gray-900`.

### 4.8 Modal / Dialog

- Backdrop `rgba(15,23,42,.5)`, có thể blur 4px.
- Modal bg white, radius `r-xl` (12px), `shadow-xl`. Sizes: sm 400 / md 560 / lg 720 / xl 960px.
- Header padding 20-24px: title h2 (17-20px weight 600) + close icon 16-20px phải.
- Body padding 24px, scroll nếu dài (max-height ~70vh).
- Footer padding `14-16px 24px`, border-top, button align phải (cancel ghost + primary/accent).
- Confirm destructive: icon AlertTriangle/X trong vòng tròn màu danger, body gọn, nút "Huỷ" + "Xoá" (danger).
- Animation: `scale(0.97)→1` + fade, 200ms `cubic-bezier(0.16,1,0.3,1)`.

### 4.9 Drawer (slide-over)

- Slide từ phải. Width 480-600px. Bg white, border-left `gray-200`, `shadow-xl`.
- Header (border-bottom) → body scroll → footer sticky (border-top, actions).
- Backdrop `rgba(15,23,42,.35)`. Transform `translateX(100%)→0`, 200ms ease-out. Đóng bằng ESC + click backdrop.

### 4.10 Toast

- Top-right, width ~380px, padding 14-16px, radius `r-lg`, `shadow-lg`, bg white.
- **Border-left 4px** theo variant (success/danger/warning/info). Icon variant + title 13px weight 600 + body 12px `gray-500` + close.
- Auto-dismiss 4-5s (success), không tự dismiss (danger).

### 4.11 Stepper

- Horizontal. Circle 28px: pending bg `gray-200` text `gray-500`; current bg `navy-700` trắng + focus-ring; done bg `success-600` + check trắng.
- Label dưới circle 12-13px (current weight 600 `gray-900`, pending `gray-400`).
- Line nối: pending `gray-200`, done `success-600`.

### 4.12 Dropdown Menu

- Panel bg white, `shadow-md`, radius `r-md/r-lg`, padding 4px, min-width 180px.
- Item h36, padding `0 10-12px`, font 13px, icon 14px trái. Hover bg `gray-50/gray-100`.
- Danger item (Xoá): text `danger-600`, hover bg `danger-50`.
- Divider 1px `gray-200` margin `2-4px 0`.

### 4.13 Empty state

- Center. Icon outline 48-56px màu `gray-300/gray-400`. Title h3-h4 weight 600 `gray-900`. Sub-text body-sm `gray-500` max-width 320px. CTA button (tùy chọn).

### 4.14 Charts (nếu cần)

- Màu series: primary `navy-700`, phụ `#0891B2` (teal), `#D97706` (amber), `#16A34A` (green), `#7C3AED` (purple).
- Grid line `gray-200` dashed `4 4`. Axis text 11-12px `gray-400`.
- KHÔNG 3D, KHÔNG gradient fill loè loẹt. Area fill opacity ~0.08-0.12.
- Donut/Pie: hole 60%, không viền giữa segment.
- Bar: radius nhỏ 4px ở đầu thanh.
- Sparkline: line 1.5px + area fill nhạt 12%.

---

## 5 · ICONOGRAPHY

- Library: **Lucide** (lucide-react). Stroke **1.75px**.
- Size: **18px** mặc định trong UI; 16px trong button/input nhỏ; 20px trong sidebar nav; 14px trong dropdown item; 12px cho trend indicator.
- Màu: kế thừa text. Mặc định `gray-400`. Trong button primary/nav active: trắng.
- KHÔNG dùng filled icon cho UI (chỉ filled cho status dot nhỏ).
- Tuyệt đối KHÔNG vẽ icon bằng emoji trong nghiệp vụ.

---

## 6 · MOTION

- Hạn chế. Transition: **150ms ease-out** cho hover; **200ms** cho modal/drawer.
- Micro-interaction: button active `scale(0.98)`.
- Skeleton loading: pulse opacity `1 → 0.5 → 1`, 1.5s infinite. Skeleton block bg `gray-200` radius `r-sm`.
- Easing tokens:
  ```css
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --duration-fast: 150ms;
  --duration-base: 200ms;
  --duration-slow: 300ms;
  ```
- TUYỆT ĐỐI KHÔNG: bouncy spring, parallax, scroll-triggered animation, particle effect, infinite decorative loop.

---

## 7 · TRẠNG THÁI BẮT BUỘC (mỗi màn data phải có đủ)

1. **Loading** — skeleton giữ đúng cấu trúc (số dòng, cột) — KHÔNG spinner toàn trang.
2. **Empty (lọc ra 0)** — icon + "Không tìm thấy..." + nút "Xoá bộ lọc".
3. **Empty (chưa có data)** — icon + mô tả + CTA tạo mới.
4. **Error** — banner danger + nút "Tải lại".
5. **Default** — dữ liệu thật.

---

## 8 · TAILWIND CONFIG MẪU (rút gọn)

```ts
// tailwind.config.ts — theme override (KHÔNG để màu Tailwind mặc định rò rỉ)
theme: {
  colors: {
    transparent:'transparent', current:'currentColor', white:'var(--white)', black:'#000',
    navy:{950:'var(--navy-950)',900:'var(--navy-900)',800:'var(--navy-800)',700:'var(--navy-700)',600:'var(--navy-600)',500:'var(--navy-500)',300:'var(--navy-300)',100:'var(--navy-100)',50:'var(--navy-50)'},
    gray:{50:'var(--gray-50)',100:'var(--gray-100)',200:'var(--gray-200)',300:'var(--gray-300)',400:'var(--gray-400)',500:'var(--gray-500)',700:'var(--gray-700)',900:'var(--gray-900)'},
    accent:{700:'var(--accent-700)',600:'var(--accent-600)',500:'var(--accent-500)',100:'var(--accent-100)',50:'var(--accent-50)'},
    success:{700:'var(--success-700)',600:'var(--success-600)',100:'var(--success-100)',50:'var(--success-50)'},
    warning:{700:'var(--warning-700)',600:'var(--warning-600)',100:'var(--warning-100)',50:'var(--warning-50)'},
    danger:{700:'var(--danger-700)',600:'var(--danger-600)',100:'var(--danger-100)',50:'var(--danger-50)'},
    info:{700:'var(--info-700)',600:'var(--info-600)',100:'var(--info-100)',50:'var(--info-50)'},
  },
  fontFamily:{ sans:['var(--font-jakarta)','sans-serif'], mono:['var(--font-mono)','monospace'] },
  extend:{
    borderRadius:{ 'sm':'4px','md':'6px','lg':'8px','xl':'12px','pill':'999px' },
    boxShadow:{ xs:'var(--shadow-xs)',sm:'var(--shadow-sm)',md:'var(--shadow-md)',lg:'var(--shadow-lg)',xl:'var(--shadow-xl)' },
  }
}
```

### Ví dụ class hay dùng

```jsx
// Card
<div className="bg-white border border-gray-200 rounded-lg p-6">

// Primary button
<button className="h-10 px-4 bg-navy-700 hover:bg-navy-800 text-white text-sm font-medium rounded-md
                   transition-colors focus-visible:shadow-[var(--focus-ring)] active:scale-[.98]">

// Số tiền
<span className="font-mono tabular-nums text-gray-900 font-semibold">1.840.500.000 ₫</span>

// Overline label
<p className="text-[11px] font-semibold uppercase tracking-[.06em] text-gray-500">Tổng nhân viên</p>

// Badge success
<span className="inline-flex items-center gap-1.5 bg-success-100 text-success-700 text-xs font-medium
                 px-2 py-0.5 rounded-sm">
  <span className="w-1.5 h-1.5 rounded-full bg-success-600"/> Đã duyệt
</span>

// Sidebar nav item active
<a className="flex items-center gap-2.5 h-10 px-5 text-sm font-medium text-white bg-navy-700
              border-l-[3px] border-accent-500">
```

---

## 9 · CHECKLIST khi build 1 component mới

- [ ] Màu lấy từ token, KHÔNG hardcode hex
- [ ] Số liệu dùng `font-mono tabular-nums`
- [ ] Radius ≤ 12px (card 8, button/input 6, modal 12)
- [ ] Shadow nhẹ (xs/sm), card mặc định chỉ border
- [ ] Tối đa 1 nút `accent` trên màn hình
- [ ] Icon Lucide stroke 1.75, size đúng ngữ cảnh
- [ ] Hover/focus/active/disabled đầy đủ
- [ ] Body 14px, heading có letter-spacing âm
- [ ] Có đủ loading / empty / error state (nếu là data view)
- [ ] Không emoji, không gradient trang trí, không glassmorphism
- [ ] Density vừa phải — không phóng đại whitespace

---

> **Tóm tắt 1 câu cho Claude Code:** Xây UI nội bộ doanh nghiệp kiểu Stripe/Linear — navy + xám + trắng, amber chỉ cho CTA, số liệu mono tabular, border mảnh thay vì shadow, radius nhỏ, density cao, type-driven hierarchy. Tránh mọi thứ "consumer/playful".

---

# 10 · CÔNG THỨC DỰNG SẴN (tái tạo CHÍNH XÁC UI hiện tại)

> Phần này là các "recipe" trích trực tiếp từ giao diện đã build. Dựng theo đây để khớp 100%, không phải đoán.

## 10.1 Kích thước chính xác đang dùng

| Thành phần                | Giá trị THỰC TẾ                                                                                                            |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Sidebar width             | **220px** (không phải 256 — bản build dùng 220)                                                                            |
| Sidebar logo block        | h **64px**, padding `0 20px`, gap 10px                                                                                     |
| Sidebar mark (logo vuông) | **28×28px**, `bg-navy-700`, `rounded-md`, chữ "A" 13px weight 700 trắng                                                    |
| Sidebar role label        | 9px, weight 600, UPPERCASE, `tracking-[.06em]`, `text-accent-500`, mt 3px                                                  |
| Sidebar section eyebrow   | padding `14px 20px 5px`, 10px weight 600 UPPERCASE `tracking-[.06em]`, `rgba(255,255,255,.28)`                             |
| Sidebar nav item          | h **38px**, padding `0 20px`, font 13px weight 500, `rgba(255,255,255,.65)`, border-left 3px transparent                   |
| — hover                   | `bg-[rgba(255,255,255,.04)]` + text trắng                                                                                  |
| — active                  | `bg-navy-700` + `border-l-[3px] border-accent-500` + text trắng                                                            |
| Sidebar footer            | border-top `rgba(255,255,255,.06)`, padding `10px 16px`, avatar 24px + tên 11px + role 10px                                |
| Topbar                    | h **64px**, `bg-white`, border-b `gray-200`, padding `0 32px`                                                              |
| Topbar breadcrumb         | 14px, `gray-500`, current `gray-900` weight 500, separator `/` `gray-300`                                                  |
| Topbar search (giữa)      | w **260px**, h 32px, `bg-gray-50`, border trong suốt, `rounded-md`, icon 13px, hint "Ctrl K" trong pill `bg-gray-200` 10px |
| Main content              | `bg-gray-50`, padding **`24px 32px 40px`** (trên-ngang-dưới)                                                               |
| Page header h1            | **22px** (không phải 24) weight 600 `tracking-[-.01em]`, sub 13px `gray-500` mt 3px                                        |

## 10.2 Sidebar — markup chuẩn (copy y nguyên cấu trúc)

```jsx
<aside className="w-[220px] shrink-0 h-screen bg-navy-950 flex flex-col">
  {/* Logo */}
  <div className="h-16 flex items-center gap-2.5 px-5 border-b border-white/[.06]">
    <div
      className="w-7 h-7 bg-navy-700 rounded-md flex items-center justify-center
                    text-[13px] font-bold text-white shrink-0"
    >
      A
    </div>
    <div>
      <div className="text-sm font-bold text-white leading-none">ATRIA</div>
      <div className="text-[9px] font-semibold text-accent-500 uppercase tracking-[.06em] mt-[3px]">
        HR
      </div>
    </div>
  </div>
  {/* Nav */}
  <nav className="flex-1 overflow-y-auto py-2">
    <p
      className="px-5 pt-3.5 pb-1.5 text-[10px] font-semibold uppercase tracking-[.06em]
                  text-white/[.28]"
    >
      TỔNG QUAN
    </p>
    <a
      className="flex items-center h-[38px] px-5 text-[13px] font-medium
                  border-l-[3px] border-accent-500 bg-navy-700 text-white"
    >
      Dashboard
    </a>
    <a
      className="flex items-center h-[38px] px-5 text-[13px] font-medium
                  border-l-[3px] border-transparent text-white/[.65]
                  hover:bg-white/[.04] hover:text-white transition-colors"
    >
      Hồ sơ nhân viên
    </a>
  </nav>
  {/* Footer */}
  <div className="border-t border-white/[.06] px-4 py-2.5 flex items-center gap-2">
    <Avatar name="Ngô Thị Phương" size={24} />
    <div className="flex-1 min-w-0">
      <div className="text-[11px] font-medium text-white truncate">
        Ngô Thị Phương
      </div>
      <div className="text-[10px] text-white/40 mt-0.5">HR Manager</div>
    </div>
  </div>
</aside>
```

> Nav item có badge số (vd đơn chờ duyệt): thêm `<span className="bg-accent-600 text-white text-[11px] font-semibold px-1.5 py-0.5 rounded-pill">3</span>` đẩy phải bằng `justify-between`.

## 10.3 KPI Card — công thức chính xác

```jsx
<div className="bg-white border border-gray-200 rounded-lg p-5">
  <p className="text-[10px] font-semibold uppercase tracking-[.06em] text-gray-500 mb-3">
    TỔNG NHÂN VIÊN
  </p>
  <div className="flex items-end justify-between gap-2">
    <div>
      <p
        className="font-mono tabular-nums text-[36px] font-bold leading-none
                    text-gray-900 tracking-[-.02em]"
      >
        247
      </p>
      <div className="flex items-center gap-1 mt-2">
        <TrendingUp size={12} className="text-success-600" />
        <span className="text-xs font-medium text-success-600">+8</span>
        <span className="text-xs text-gray-500">tháng này</span>
      </div>
    </div>
    {/* sparkline 80×32 optional */}
  </div>
</div>
```

- Số KPI: **36px** mono bold, `tracking-[-.02em]`, `leading-none`.
- Nếu có đơn vị (VNĐ): số 28px, đơn vị 12-16px `gray-400` font-sans ngay sau.
- Trend: icon 12px + delta màu success/danger + text so sánh `gray-500` 12px.
- Grid KPI: `grid grid-cols-4 gap-4` (gap **16px**).

## 10.4 Page header pattern (mọi trang list/detail)

```jsx
<div className="flex items-start justify-between gap-4 mb-5">
  <div>
    <h1 className="text-[22px] font-semibold text-gray-900 tracking-[-.01em]">
      Tiêu đề trang
    </h1>
    <p className="text-sm text-gray-500 mt-[3px]">
      247 bản ghi ·{" "}
      <span className="text-warning-700 font-medium">12 cần chú ý</span>
    </p>
  </div>
  <div className="flex items-center gap-2 shrink-0">
    <button className="...secondary">Xuất Excel</button>
    <button className="...accent">+ Tạo mới</button> {/* duy nhất 1 accent */}
  </div>
</div>
```

> Số trong sub-text dùng dấu `·` (middot) ngăn cách, phần "cảnh báo" tô màu warning/danger.

## 10.5 Toolbar trên table

```jsx
<div className="bg-white border border-gray-200 rounded-lg p-3.5 mb-4
                flex items-center gap-2.5 flex-wrap">
  {/* search */}
  <div className="relative flex items-center w-[300px] h-9 bg-white border border-gray-300
                  rounded-md focus-within:border-navy-500
                  focus-within:shadow-[0_0_0_3px_rgba(30,58,107,.15)]">
    <Search size={15} className="absolute left-2.5 text-gray-400 pointer-events-none"/>
    <input className="flex-1 h-full bg-transparent outline-none pl-9 pr-2 text-[13px]" .../>
  </div>
  {/* filter chips */}
  <FilterChip label="Phòng ban" .../>
  {/* reset (chỉ hiện khi có filter) */}
  <button className="text-gray-500 hover:text-gray-900 text-[13px] h-8 px-2">✕ Đặt lại</button>
</div>
```

**FilterChip** (chip có dropdown): h **34px**, padding `0 10px`, `rounded-md`, border `gray-300`. Khi applied: `bg-navy-50 border-navy-300 text-navy-700` + count badge tròn `bg-navy-700 text-white text-[10px]`. Chevron 12px `gray-400` xoay 180° khi mở. Panel dropdown: `bg-white border-gray-200 rounded-lg shadow-md`, items checkbox `accent-color: navy-700`, footer 2 nút "Xoá" (secondary) + "Áp dụng" (navy filled).

## 10.6 Table — chi tiết khớp build

```jsx
<div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
  <table className="w-full border-collapse">
    <thead>
      <tr className="bg-gray-50 border-b border-gray-200">
        <th
          className="h-11 px-3 text-[11px] font-semibold uppercase tracking-[.04em]
                       text-gray-400 text-left whitespace-nowrap"
        >
          Mã NV
        </th>
        {/* cột số: thêm text-right */}
      </tr>
    </thead>
    <tbody>
      <tr className="h-14 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
        <td className="px-3 font-mono text-xs text-gray-700">EMP-0042</td>
        {/* cột tiền */}
        <td className="px-3 text-right font-mono tabular-nums text-xs font-medium text-gray-900">
          35.000.000 ₫
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

- Header: h **44px**, 11px weight 600 UPPERCASE `tracking-[.04em]` `text-gray-400`.
- Row: h **56px** (md) / 52px / 48px (compact). Border `gray-100` (ngang), KHÔNG dọc.
- Hover `bg-gray-50`. Selected `bg-navy-50` + `td:first-child` border-left 3px navy-700.
- Cột số/tiền: `text-right font-mono tabular-nums`. Khấu trừ/âm: `text-danger-600` với dấu `-`.
- Cột "Thực lĩnh"/tổng: weight 700, `text-navy-700`.
- Cột nhân viên: `<Avatar 28-32/>` + tên (13-14px weight 500) + email (11-12px `gray-500`) xếp dọc.
- Row cảnh báo: `bg-warning-50` nhẹ + `<AlertCircle 13 className="text-warning-600"/>`.
- Padding ô đầu/cuối: `pl-5` / `pr-5` (20px); ô giữa `px-3`.

## 10.7 Banner & Callout (dùng nhiều)

```jsx
{
  /* warning banner */
}
<div
  className="flex items-center gap-2.5 px-4 py-3 rounded-md border-l-[3px] border-warning-600
                bg-warning-50 mb-4"
>
  <AlertTriangle size={16} className="text-warning-700 shrink-0" />
  <p className="text-[13px] text-warning-700 flex-1">
    <strong>12 hợp đồng</strong> sẽ hết hạn trong 60 ngày tới.
  </p>
  <button className="text-accent-600 text-[13px] font-medium">
    Xem ngay →
  </button>
</div>;
```

Callout chung: `flex items-start gap-2.5 px-3.5 py-3 rounded-md border-l-[3px]`. 4 variant — info (`navy-50`/`navy-600`/`navy-700`), warning (`warning-50/600/700`), danger (`danger-50/600/700`), success (`success-50/600/700`). Icon variant 16px + text 13px line-height 1.5.

## 10.8 Detail banner (trang hồ sơ — header có nền brand)

```jsx
<div className="bg-navy-50 border-b border-navy-100 px-8 py-7">
  <p className="text-[13px] text-gray-500 mb-3">
    Breadcrumb · ... · <strong className="text-gray-900">Tên</strong>
  </p>
  <div className="flex items-start gap-5">
    <Avatar size={80} />
    <div className="flex-1">
      <h1 className="text-[26px] font-bold text-gray-900 tracking-[-.02em] flex items-center gap-2.5">
        Nguyễn Văn An
        <span className="badge b-success">● Đang làm</span>
      </h1>
      <p className="text-sm text-gray-600 mt-1">Chức danh</p>
      {/* meta row: icon 14 + text 13 gray-500, ngăn bằng dấu · */}
      {/* badge row: Full-time / Manager / Employee */}
    </div>
    <div className="flex flex-col items-end gap-1.5">
      {/* action buttons + "Cập nhật ... bởi ..." 12px gray-500 */}
    </div>
  </div>
</div>
```

## 10.9 Drawer (slide-over phải) — kích thước thực

- Width: **480px** (task/quick view) hoặc **560-600px** (chi tiết nhiều, audit/payslip).
- `fixed top-0 right-0 bottom-0`, `bg-white border-l border-gray-200 shadow-xl`, `translate-x-full → 0`, 200ms ease-out.
- Backdrop `bg-[rgba(15,23,42,.35)]`.
- Header padding `20px 24px` border-b → body `flex-1 overflow-y-auto px-6 pb-6` → footer `px-6 py-3.5` border-t, nút align phải.
- Section trong drawer: title overline 11px `gray-400` mb 10px + border-b 1px; row info `flex justify-between py-2 border-b border-gray-100 text-[13px]` (label `gray-500`, value `gray-900` weight 500).

## 10.10 Demo panel (CHỈ trong file preview — BỎ khi vào production)

Các file HTML hiện có 1 `.demo-panel` góc dưới phải để xem nhiều state. **Đây là công cụ preview, KHÔNG phải UI thật** — khi dựng React production thì bỏ hoàn toàn, thay bằng state thật từ data/props.

## 10.11 "Cảm giác" tổng thể cần giữ

- **Khoảng cách:** thoáng vừa phải. Card padding 20-24px, KHÔNG 32-40px. Gap KPI/section 16-24px.
- **Đường viền > đổ bóng:** phân tách bằng `border-gray-200`, shadow chỉ xuất hiện khi hover hoặc nổi (modal/drawer/dropdown).
- **Màu rất kiệm:** mở 1 màn bất kỳ → 90% là trắng/xám/navy. Chỉ thấy amber ở đúng 1 nút CTA, green/red/amber ở badge status. Nếu thấy nhiều mảng màu → SAI.
- **Số liệu nổi bật:** mọi con số mono, căn phải trong bảng, to & đậm ở KPI.
- **Heading siết chặt:** luôn có `tracking-[-.01em]` (số lớn `-.02em`).
- **Nhất quán icon:** Lucide 1.75px, không trộn bộ icon khác.

---

> **Khi áp vào dự án của bạn:** giữ nguyên token màu (mục 1) + font (mục 2) + các recipe mục 10 → UI sẽ khớp ngay, không cần tinh chỉnh lại. Nếu component của bạn chưa có trong đây, suy ra từ nguyên tắc mục 0 + checklist mục 9.
