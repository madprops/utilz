const Utilz = {}

// Only chars
Utilz.only_chars = (s) => {
  return s.replace(/[^\w]/g, ``)
}

// No spaces
Utilz.no_space = (s) => {
  return s.replace(/\s+/g, ``)
}

// Clean string util
Utilz.single_space = (s) => {
  return s.replace(/\s+/g, ` `)
}

// Clean string util
Utilz.clean_username = (s) => {
  return s.replace(/[^a-z0-9]+/gi, ``).replace(/ +/g, ` `).trim()
}

// Clean string util
Utilz.no_space = (s) => {
  return s.replace(/\s+/g, ``).trim()
}

// Replace multiple empty lines with a single one
Utilz.remove_multiple_empty_lines = (s, level = 1) => {
  let ns = []
  let charge = 0
  let split = s.split(`\n`)

  for (let line of split) {
    if (line.trim() === ``) {
      if (charge < level) {
        ns.push(line)
      }

      charge += 1
    }
    else {
      charge = 0
      ns.push(line)
    }
  }

  let pf = ns.join(`\n`)

  return pf
}

// Remove empty lines from the start
Utilz.remove_pre_empty_lines = (s) => {
  let split = s.split(`\n`)
  let counter = 0

  for (let line of split) {
    if (line.trim()) {
      return split.slice(counter).join(`\n`)
    }
    else {
      counter += 1
    }
  }
}

// No empty lines
Utilz.single_linebreak = (s) => {
  return s.replace(/(\n\s*){2,}/g, `\n\n`).replace(/ +/g, ` `).trim()
}

// Max 1 empty line
Utilz.double_linebreak = (s) => {
  return s.replace(/(\n\s*){3,}/g, `\n\n`).replace(/ +/g, ` `).trim()
}

// Get a random int from min to max. Optional exclude a number. Optional seeded random function
Utilz.random_int = (min, max, exclude = undefined, random_function) => {
  let num

  if (random_function) {
    num = Math.floor(random_function() * (max - min + 1) + min)
  }
  else {
    num = Math.floor(Math.random() * (max - min + 1) + min)
  }

  if (exclude !== undefined) {
    if (num === exclude) {
      if (num + 1 <= max) {
        num = num + 1
      }
      else if (num - 1 >= min) {
        num = num - 1
      }
    }
  }

  return num
}

// Shuffle an array
Utilz.shuffle_array = (array) => {
  for (let i=array.length-1; i>0; i--) {
    let j = Math.floor(Math.random() * (i + 1))
    let temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
}

// Get a random string of n length
Utilz.get_random_string = (n) => {
  let text = ``

  let possible = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`

  for (let i=0; i<n; i++) {
    text += possible[Utilz.random_int(0, possible.length - 1)]
  }

  return text
}

// Ge a random sequence of numbers
Utilz.random_sequence = (n) => {
  let s = ``

  for (let i=0; i<n; i++) {
    s += Utilz.random_int(0, 9)
  }

  return s
}

// Get id of youtube video from url
Utilz.get_youtube_id = (url) => {
  let v_id = false
  let list_id = false
  let split = url.split(/(vi\/|v%3D|v=|\/v\/|youtu\.be\/|\/embed\/)/)
  let id = undefined !== split[2] ? split[2].split(/[^0-9a-z_\-]/i)[0] : split[0]
  v_id = id.length === 11 ? id : false
  let list_match = url.match(/(?:\?|&)(list=[0-9A-Za-z_-]+)/)
  let index_match = url.match(/(?:\?|&)(index=[0-9]+)/)

  if (list_match) {
    list_id = list_match[1].replace(`list=`, ``)
  }

  if (list_id && !v_id) {
    let index = 0

    if (index_match) {
      index = parseInt(index_match[1].replace(`index=`, ``)) - 1
    }

    return [`list`, [list_id, index]]
  }
  else if (v_id) {
    return [`video`, v_id]
  }
}

// Get timestamp of a youtube video from url
Utilz.get_youtube_time = (url) => {
  let matches = url.match(/[\?|&]t=(\d+h)?(\d+m)?(\d+s)?(\d+)?/)

  if (matches) {
    let first = false

    let h = false
    let m = false
    let s = false
    let t = false

    for (let match of matches) {
      if (!first) {
        first = true
        continue
      }

      if (match === undefined) {
        continue
      }

      if (match.includes(`h`)) {
        h = parseInt(match.replace(`h`, ``))
      }
      else if (match.includes(`m`)) {
        m = parseInt(match.replace(`m`, ``))
      }
      else if (match.includes(`s`)) {
        s = parseInt(match.replace(`s`, ``))
      }
      else {
        t = parseInt(match)
      }

    }

    let time = 0

    if (h) {
      time += h * 60 * 60
    }

    if (m) {
      time += m * 60
    }

    if (s) {
      time += s
    }

    if (t) {
      time += t
    }

    return time
  }
  else {
    return 0
  }
}

// Get twitch id from url
Utilz.get_twitch_id = (url) => {
  let match = url.match(/.*twitch\.tv(?:\/videos)?\/(\w+)/)

  if (match) {
    if (match[0].includes(`twitch.tv/videos/`)) {
      return [`video`, match[1]]
    }
    else if (match[0].includes(`clips.twitch.tv`)) {
      return
    }
    else {
      return [`channel`, match[1]]
    }
  }
}

// Round to specified decimal places
Utilz.round = (value, decimals) => {
  return Number(Math.round(value + `e` + decimals) + `e-` + decimals)
}

// Round to place or the place below
Utilz.round2 = (value, place) => {
  return Math.round(value / place) * place
}

// Get a string with nice seconds format
Utilz.humanize_seconds = (input, separator = `:`) => {
  let pad = (input) => {
    return input < 10 ? `0` + input : input
  }

  let result = [
    pad(Math.floor(input / 3600)),
    pad(Math.floor(input % 3600 / 60)),
    pad(Math.floor(input % 60)),
  ].join(separator)

  return result
}

// Replace spaces with non-brekable spaces
Utilz.nonbreak = (s) => {
  return s.trim().split(` `).join(`&nbsp;`)
}

// Extract extension from a string
Utilz.get_extension = (s) => {
  if (s.startsWith(`http://`) || s.startsWith(`https://`)) {
    let u = new URL(s)
    let url = u.origin + u.pathname
    let url_2 = url.split(`//`).slice(1).join(`//`)
    let matches = url_2.match(/\/.*\.(\w+)(?=$|[#?])/)

    if (matches) {
      return matches[1]
    }
  }
  else {
    let matches = s.match(/\.(\w+)(?=$|[#?])/)

    if (matches) {
      return matches[1]
    }
  }

  return ``
}

// Check if hex value is valid
Utilz.validate_hex = (hex, case_sensitive = true) => {
  let re

  if (case_sensitive) {
    re = /^#[0-9a-f]{6}$/
  }
  else {
    re = /^#[0-9A-F]{6}$/i
  }

  return re.test(hex)
}

// Get the code from an imgur url
Utilz.get_imgur_image_code = (src) => {
  let matches = src.match(/https?\:\/\/(?:i.)?imgur.com\/(\w{7,8})(?:\.\w+)?$/)

  if (matches) {
    return matches[1].substring(0, 7)
  }
}

// Capitalize one word
Utilz.capitalize = (s) => {
  let w = s.charAt(0).toUpperCase() + s.slice(1)
  let lower = w.toLowerCase()

  if (lower === `url`) {
    w = `URL`
  }

  return w
}

// Capitalize all words
Utilz.capitalize_words = (s) => {
  let words = s.split(/[_\s]+/)

  let capitalized = words.map(word => {
    return App.capitalize(word)
  })

  return capitalized.join(` `)
}

// Make a string of nicely separated items
Utilz.nice_list = (list) => {
  let s = ``

  for (let i=0; i<list.length; i++) {
    let item = list[i]

    if (i === 0) {
      s = item
    }
    else if (i === list.length - 1) {
      s = `${s} and ${item}`
    }
    else {
      s = `${s}, ${item}`
    }
  }

  return s
}

// Check if string is a url
Utilz.is_url = (s) => {
  if (s.startsWith(`http://`) || s.startsWith(`https://`)) {
    if (s.endsWith(`]`)) {
      return false
    }
    else if (s.endsWith(`"`)) {
      return false
    }
    else if (s.endsWith(`'`)) {
      return false
    }

    return true
  }

  return false
}

// Get first url from a string
Utilz.get_first_url = (s) => {
  let split = s.split(`\n`)

  for (let line of split) {
    let split2 = line.split(` `)

    for (let word of split2) {
      if (word) {
        if (Utilz.is_url(word)) {
          return word
        }
      }
    }
  }

  return ``
}

Utilz.get_urls = (s) => {
  let urls = []
  let split = s.split(`\n`)

  for (let line of split) {
    let split2 = line.split(` `)

    for (let word of split2) {
      if (word) {
        if (Utilz.is_url(word)) {
          urls.push(word)
        }
      }
    }
  }

  return urls
}

// Crop a text from the left and add ...
Utilz.slice_string_end = (s, n = 10) => {
  s = s.trim()
  let sliced = s.slice(-n).trim()

  if (s.length > sliced.length) {
    return `...${sliced}`
  }
  else {
    return sliced
  }
}

// Replace a string between point start and point end with what
Utilz.replace_between = (str, start, end, what) => {
  return str.substring(0, start) + what + str.substring(end)
}

// Get a nice date string
// Requires dateFormat.js
Utilz.nice_date = (date = Date.now()) => {
  return dateFormat(date, `dd/mmm/yy | h:MM:ss tt`)
}

// Escape special characters
Utilz.escape_regex = (s) => {
  return s.replace(/[^A-Za-z0-9]/g, `\\$&`)
}

// Get a string with the size in megabytes
Utilz.size_string = (size, mode = 1) => {
  if (mode === 1) {
    return `${parseFloat(size / 1024).toFixed(2)} MB`
  }
  else if (mode === 2) {
    return `${parseFloat(size / 1024 / 1024).toFixed(2)} MB`
  }
}

// Check if object is empty
Utilz.is_empty_object = (obj) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object
}

// Get a nice datetime string
Utilz.nice_time = (date1, date2) => {
  let d

  if (date1 > date2) {
    d = (date1 - date2)
  }
  else {
    d = (date2 - date1)
  }

  let nt

  if (d >= 1000) {
    let dm = Utilz.round(d / 1000, 3)

    if (dm === 1) {
      nt = `${dm} second`
    }
    else {
      nt = `${dm} seconds`
    }
  }
  else {
    if (d === 1) {
      nt = `${d} millisecond`
    }
    else {
      nt = `${d} milliseconds`
    }
  }

  return nt
}

// Remove the s from a word if singular
Utilz.singular_or_plural = (n, s) => {
  let ss

  if (n === 1) {
    ss = `${n} ${s.substring(0, s.length - 1)}`
  }
  else {
    ss = `${n} ${s}`
  }

  return ss
}

// Check if it's a text element
Utilz.is_textbox = (element) => {
  let tag_name = element.tagName.toLowerCase()

  if (tag_name === `textarea`) {
    return true
  }

  if (tag_name !== `input`) {
    return false
  }

  let type = element.getAttribute(`type`)

  if (!type) {
    return false
  }

  let input_types = [
    `text`,
    `password`,
    `number`,
    `email`,
    `tel`,
    `url`,
    `search`,
    `date`,
    `datetime`,
    `datetime-local`,
    `time`,
    `month`,
    `week`
  ]

  return input_types.includes(type.toLowerCase())
}

// Crop a string and add ... to it
Utilz.get_limited_string = (s, n) => {
  let title

  if (s.length > n) {
    title = `${s.substring(0, n)}...`
  }
  else {
    title = s
  }

  return title
}

// Turn a string into safe HTML by replacing < and > to safe versions
Utilz.make_html_safe = (s) => {
  return s.replace(/\</g, `&lt;`).replace(/\>/g, `&gt;`)
}

// Find the similarity between two strings
Utilz.similarity = (s1, s2) => {
  let longer = s1
  let shorter = s2

  if (s1.length < s2.length) {
    longer = s2
    shorter = s1
  }

  let longer_length = longer.length

  if (longer_length == 0) {
    return 1.0
  }

  return (longer_length - Utilz.similarity_distance(longer, shorter)) / parseFloat(longer_length)
}

// Find the similarity distance between two strings
Utilz.similarity_distance = (s1, s2) => {
  s1 = s1.toLowerCase()
  s2 = s2.toLowerCase()

  let costs = new Array()

  for (let i=0; i<=s1.length; i++) {
    let last_value = i

    for (let j = 0; j <= s2.length; j++) {
      if (i == 0) {
        costs[j] = j
      }
      else {
        if (j > 0) {
          let new_value = costs[j - 1]

          if (s1.charAt(i - 1) != s2.charAt(j - 1)) {
            new_value = Math.min(Math.min(new_value, last_value),
              costs[j]) + 1
          }

          costs[j - 1] = last_value
          last_value = new_value
        }
      }
    }

    if (i > 0) {
      costs[s2.length] = last_value
    }
  }

  return costs[s2.length]
}

// Remove extra tabbing from the left side
Utilz.untab_string = (s) => {
  s = s.replace(/\t/gm, `  `)
  let lines = s.split(`\n`)

  if (lines.length <= 1) {
    return s
  }

  let ns = []
  let pos = -1

  for (let line of lines) {
    if (!line.trim()) {
      continue
    }

    let m = line.match(/^\s+/)

    if (m) {
      let n = m[0].length

      if (pos === -1 || n < pos) {
        pos = n
      }

      ns.push(n)
    }
    else {
      return s
    }
  }

  let new_lines = []
  let spaces = ``

  for (let i=0; i<pos; i++) {
    spaces += ` `
  }

  for (let line of lines) {
    let re = new RegExp(`(^${spaces})`)
    new_lines.push(line.replace(re, ``))
  }

  return new_lines.join(`\n`)
}

Utilz.MINUTE = 60000
Utilz.HOUR = 3600000
Utilz.DAY = 86400000
Utilz.YEAR = 31536000000

// Return a timeago string
Utilz.timeago = (date) => {
  let diff = Date.now() - date
  let s

  if (diff < Utilz.MINUTE) {
    s = `just now`
  }
  else if (diff < Utilz.HOUR) {
    let n = Math.floor(diff / 60 / 1000)

    if (n === 1) {
      s = `${n} minute ago`
    }
    else {
      s = `${n} minutes ago`
    }
  }
  else if (diff >= Utilz.HOUR && diff < Utilz.DAY) {
    let n = Math.floor(diff / 60 / 60 / 1000)

    if (n === 1) {
      s = `${n} hour ago`
    }
    else {
      s = `${n} hours ago`
    }
  }
  else if (diff >= Utilz.DAY && diff < Utilz.YEAR) {
    let n = Math.floor(diff / 24 / 60 / 60 / 1000)

    if (n === 1) {
      s = `${n} day ago`
    }
    else {
      s = `${n} days ago`
    }
  }
  else if (diff >= Utilz.YEAR) {
    let n = Math.floor(diff / 365 / 24 / 60 / 60 / 1000)

    if (n === 1) {
      s = `${n} year ago`
    }
    else {
      s = `${n} years ago`
    }
  }

  return s
}

// Fill from the left with c character to get to n ammount
Utilz.fillpad = (s, n, c) => {
  s = s.toString()
  let olen = s.length

  for (let i=0; i<(n - olen); i++) {
    s = c + s
  }

  return s
}

// Get a nicely formatted time
Utilz.get_time = () => {
  let c = Utilz.time_components(new Date())
  return `${c.hours}:${c.minutes}:${c.seconds}`
}

// Show information with date
Utilz.loginfo = (s) => {
  try {
    console.info(`[${Utilz.get_time()}] ${s}`)
  }
  catch (err) {
    console.error(err)
  }
}

// Make a url with a parameter that prevents caching
Utilz.cache_bust_url = (s) => {
  let url = new URL(s)
  url.searchParams.set(`cache-buster`, Date.now())
  return url
}

// Check if file name is from an image source
Utilz.is_image = (src) => {
  let extension = Utilz.get_extension(src).toLowerCase()
  return extension && Utilz.image_extensions.includes(extension)
}

// Check if file name is from a video source
Utilz.is_video = (src) => {
  let extension = Utilz.get_extension(src).toLowerCase()
  return extension && Utilz.video_extensions.includes(extension)
}

// Check if file name is from an audio source
Utilz.is_audio = (src) => {
  let extension = Utilz.get_extension(src).toLowerCase()
  return extension && Utilz.audio_extensions.includes(extension)
}

// Check if all items in an array are equal
Utilz.bingo = (s) => {
  let split = s.split(``).filter(x => x !== ``)
  return new Set(split).size === 1
}

// Get date time components, hours, minutes, seconds
Utilz.time_components = (ms) => {
  let date = new Date(ms)
  let hours = Utilz.fillpad(date.getHours().toString(), 2, `0`)
  let minutes = Utilz.fillpad(date.getMinutes().toString(), 2, `0`)
  let seconds = Utilz.fillpad(date.getSeconds().toString(), 2, `0`)
  return {hours: hours, minutes: minutes, seconds: seconds}
}

// Number range with a certain increment
Utilz.number_range = (to, from, increment) => {
  let numbers = []
  let n = to

  while (n < 1000000) {
    numbers.push(n)
    n += increment

    if (n > from) {
      break
    }
  }

  return numbers
}

// Get the middle item of an array
Utilz.get_middle_item = (arr) => {
  return arr[Math.round((arr.length - 1) / 2)]
}

// Move an item in an array
Utilz.move_in_array = (arr, from, to) => {
  arr.splice(to, 0, arr.splice(from, 1)[0])
}

// Centralized function to create debouncers
Utilz.create_debouncer = (func, delay) => {
  if (typeof func !== `function`) {
    console.error(`Invalid debouncer function`)
    return
  }

  if (!delay) {
    console.error(`Invalid debouncer delay`)
    return
  }

  let timer
  let obj = {}

  function clear () {
    clearTimeout(timer)
  }

  function run (...args) {
    func(...args)
  }

  obj.call = (...args) => {
    clear()

    timer = setTimeout(() => {
      run(...args)
    }, delay)
  }

  obj.now = (...args) => {
    clear()
    run(...args)
  }

  obj.cancel = () => {
    clear()
  }

  return obj
}

// Centralized function to create throttles
Utilz.create_throttle = (func, delay) => {
  let timer
  let obj = {}
  let last_call = 0

  function clear () {
    clearTimeout(timer)
  }

  function run (...args) {
    func(...args)
    last_call = Date.now()
  }

  obj.call = (...args) => {
    if ((Date.now() - last_call) > delay) {
      clear()
      run(...args)
    }
    else {
      clear()

      timer = setTimeout(() => {
        run(...args)
      }, delay)
    }
  }

  return obj
}

// Get a random choice from a list
Utilz.random_choice = (list, rand) => {
  return list[Utilz.random_int(0, list.length - 1, undefined, rand)]
}

// Get item coords
Utilz.get_coords = (el) => {
  let rect = el.getBoundingClientRect()
  return {x: rect.left, y: rect.top}
}

// Get singular or plural
Utilz.plural = (n, singular, plural) => {
  if (n === 1) {
    return `${n.toLocaleString()} ${singular}`
  }
  else {
    return `${n.toLocaleString()} ${plural}`
  }
}

// Get singular or plural without the number
Utilz.plural_2 = (n, singular, plural) => {
  if (n === 1) {
    return singular
  }
  else {
    return plural
  }
}

// Get url hostname
Utilz.get_hostname = (url) => {
  let url_obj

  try {
    url_obj = new URL(url)
  }
  catch (err) {
    return ``
  }

  return url_obj.hostname
}

// Check if urls match
Utilz.urls_equal = (u1, u2) => {
  return Utilz.remove_slashes_end(u1) === Utilz.remove_slashes_end(u2)
}

// Remove slashes from ending
Utilz.remove_slashes_end = (s) => {
  return s.replace(/\/+$/g, ``)
}

// Remove hash from url
Utilz.remove_hash = (url) => {
  return url.split(`#`)[0]
}

// The way to format urls
Utilz.format_url = (url) => {
  return Utilz.remove_slashes_end(Utilz.remove_hash(url))
}

// Check if item's protocol is http
Utilz.is_http = (item) => {
  return item.protocol === `http:` || item.protocol === `https:`
}

// Copy text to the clipboard
Utilz.copy_to_clipboard = (text, feedback = false) => {
  navigator.clipboard.writeText(text)

  if (feedback) {
    // Show something
  }
}

// Remove protocol like https://
Utilz.remove_protocol = (url) => {
  return url.replace(/^https?:\/\//, ``)
}

Utilz.log = (message, mode = `normal`) => {
  let icon

  if (mode === `normal`) {
    icon = `🟢`
  }
  else if (mode === `error`) {
    icon = `🔴`
  }

  console.info(`${icon} Log: ${message}`)
}

// Parse bool string
Utilz.bool = (string) => {
  return string.toLowerCase() === `true`
}

// Remove "quotes from a string"
Utilz.unquote = (text) => {
  return text.replace(/^"(.*)"$/, `$1`)
}

// Rotate an array forwards or backwards
Utilz.rotate_array = (arr, count) => {
  let len = arr.length
  arr.push(...arr.splice(0, (- count % len + len) % len))
}

// Return true if active element has a class
Utilz.focused_with_class = (cls) => {
  return document.activeElement.classList.contains(cls)
}

// Return true if element is fully visible
Utilz.element_is_visible = (el) => {
  let container_rect = el.parentElement.getBoundingClientRect()
  let rect = el.getBoundingClientRect()
  let top_visible = rect.top >= container_rect.top - 2
  let bottom_visible = rect.bottom <= container_rect.bottom + 2
  return top_visible && bottom_visible
}

// Find objects with the same property
Utilz.find_duplicates = (objects, property) => {
  let frequency_map = objects.reduce((map, obj) => {
    map[obj[property]] = (map[obj[property]] || 0) + 1
    return map
  }, {})

  return objects.filter(obj => frequency_map[obj[property]] > 1)
}

// Remove excess duplicates
Utilz.get_excess = (objects, property) => {
  let items = {}
  let excess = []

  for (let obj of objects) {
    if (items[obj[property]]) {
      excess.push(obj)
    }
    else {
      items[obj[property]] = obj
    }
  }

  return excess
}

// Container is at top
Utilz.is_at_top = (container) => {
  return container.scrollTop === 0
}

// Container is at bottom
Utilz.is_at_bottom = (container) => {
  return container.scrollTop + container.clientHeight === container.scrollHeight
}

// Get seed for the other function
Utilz.get_seed = (str) => {
  let h1 = 1779033703, h2 = 3144134277,
  h3 = 1013904242, h4 = 2773480762

  for (let i=0, k; i<str.length; i++) {
    k = str.charCodeAt(i)
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067)
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233)
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213)
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179)
  }

  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067)
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233)
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213)
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179)
  h1 ^= (h2 ^ h3 ^ h4), h2 ^= h1, h3 ^= h1, h4 ^= h1
  return [h1 >>> 0, h2 >>> 0, h3 >>> 0, h4 >>> 0]
}

// Seeded random number generator based on a string
Utilz.seeded_random = (str) => {
  let num = Utilz.get_seed(str)[0]

  return function() {
    let t = num += 0x6D2B79F5
    t = Math.imul(t ^ t >>> 15, t | 1)
    t ^= t + Math.imul(t ^ t >>> 7, t | 61)
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

// Place cursor at end
Utilz.cursor_at_end = (input) => {
  input.setSelectionRange(input.value.length, input.value.length)
}

// Parse a certain kind of delay string
// 1_seconds 5_seconds
// 1_minutes 5_minutes
// 1_hours 5_hours
Utilz.parse_delay = (s) => {
  let delay
  let split = s.split(`_`)

  if (split[1] === `seconds`) {
    delay = split[0] * 1000
  }
  else if (split[1] === `minutes`) {
    delay = split[0] * 1000 * 60
  }
  else if (split[1] === `hours`) {
    delay = split[0] * 1000 * 60 * 60
  }

  return delay
}

// Get line where the caret is
App.get_line_under_caret = (textarea) => {
  let pos = textarea.selectionStart
  let text = textarea.value
  let start = pos
  let end = pos

  while ((start > 0) && (text[start - 1] !== `\n`)) {
    start--
  }

  while ((end < text.length) && (text[end] !== `\n`)) {
    end++
  }

  return text.substring(start, end).trim()
}

// Remove extension from string
Utilz.remove_extension = (s) => {
  return s.split(`.`).slice(0, -1).join(`.`)
}

// Return an array of number strings from start to end
Utilz.numstrings = (start, end) => {
  let nums = []

  for (let i=start; i<=end; i++) {
    nums.push(i.toString())
  }

  return nums
}

// Fill object with def args
Utilz.def_args = (def, args) => {
  for (let key in def) {
    if ((args[key] === undefined) && (def[key] !== undefined)) {
      args[key] = def[key]
    }
  }
}

// Deselect a text input
Utilz.input_deselect = (input) => {
  input.selectionStart = input.selectionEnd
}

// Sort alphabetically taking numbers into account
Utilz.sort_alpha = (array) => {
  array.sort((a, b) => {
    return a.localeCompare(b, undefined, {numeric: true, sensitivity: `base`})
  })
}

Utilz.media_types = [`image`, `tv`]
Utilz.video_extensions = [`mp4`, `webm`]
Utilz.video_types = [`video/mp4`, `video/webm`]
Utilz.audio_extensions = [`mp3`, `ogg`, `wav`, `flac`]
Utilz.audio_types = [`audio/mpeg`, `audio/ogg`, `audio/wav`, `audio/flac`]
Utilz.image_extensions = [`jpg`, `jpeg`, `png`, `gif`, `webp`, `bmp`]
Utilz.image_types = [`image/jpeg`, `image/png`, `image/gif`, `image/webp`, `image/bmp`]