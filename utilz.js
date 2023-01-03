const Utilz = {}

// Clean string util
Utilz.single_space = function (s) {
  return s.replace(/\s+/g, " ").trim()
}

// Clean string util
Utilz.clean_username = function (s) {
  return s.replace(/[^a-z0-9]+/gi, "").replace(/ +/g, " ").trim()
}

// Clean string util
Utilz.no_space = function (s) {
  return s.replace(/\s+/g, "").trim()
}

// Replace multiple empty lines with a single one
Utilz.remove_multiple_empty_lines = function (s, level = 1) {
  let ns = []
  let charge = 0
  let split = s.split("\n")

  for (let line of split) {
    if (line.trim() === "") {
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

  let pf = ns.join("\n")

  return pf
}

// Remove empty lines from the start
Utilz.remove_pre_empty_lines = function (s) {
  let split = s.split("\n")
  let counter = 0

  for (let line of split) {
    if (line.trim()) {
      return split.slice(counter).join("\n")
    }
    else {
      counter += 1
    }
  }
}

// Clean string util
Utilz.single_linebreak = function (s) {
  return s.replace(/[\n\r]+/g, "\n").replace(/ +/g, " ").trim()
}

// Get a random int from min to max. Optional exclude a number
Utilz.get_random_int = function (min, max, exclude = undefined) {
  let num = Math.floor(Math.random() * (max - min + 1) + min)

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
Utilz.shuffle_array = function (array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1))
    let temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
}

// Get a random string of n length
Utilz.get_random_string = function (n) {
  let text = ""

  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

  for (let i = 0; i < n; i++) {
    text += possible[Utilz.get_random_int(0, possible.length - 1)]
  }

  return text
}

// Ge a random sequence of numbers
Utilz.random_sequence = function (n) {
  let s = ""

  for (let i = 0; i < n; i++) {
    s += Utilz.get_random_int(0, 9)
  }

  return s
}

// Get id of youtube video from url
Utilz.get_youtube_id = function (url) {
  let v_id = false
  let list_id = false

  let split = url.split(/(vi\/|v%3D|v=|\/v\/|youtu\.be\/|\/embed\/)/)
  let id = undefined !== split[2] ? split[2].split(/[^0-9a-z_\-]/i)[0] : split[0]

  v_id = id.length === 11 ? id : false

  let list_match = url.match(/(?:\?|&)(list=[0-9A-Za-z_-]+)/)

  let index_match = url.match(/(?:\?|&)(index=[0-9]+)/)

  if (list_match) {
    list_id = list_match[1].replace("list=", "")
  }

  if (list_id && !v_id) {
    let index = 0

    if (index_match) {
      index = parseInt(index_match[1].replace("index=", "")) - 1
    }

    return ["list", [list_id, index]]
  }
  else if (v_id) {
    return ["video", v_id]
  }
}

// Get timestamp of a youtube video from url
Utilz.get_youtube_time = function (url) {
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

      if (match.includes("h")) {
        h = parseInt(match.replace("h", ""))
      }
      else if (match.includes("m")) {
        m = parseInt(match.replace("m", ""))
      }
      else if (match.includes("s")) {
        s = parseInt(match.replace("s", ""))
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
Utilz.get_twitch_id = function (url) {
  let match = url.match(/.*twitch\.tv(?:\/videos)?\/(\w+)/)

  if (match) {
    if (match[0].includes("twitch.tv/videos/")) {
      return ["video", match[1]]
    }
    else if (match[0].includes("clips.twitch.tv")) {
      return
    }
    else {
      return ["channel", match[1]]
    }
  }
}

// Round to specified decimal places
Utilz.round = function (value, decimals) {
  return Number(Math.round(value + "e" + decimals) + "e-" + decimals)
}

// Round to place or the place below
Utilz.round2 = function (value, place) {
  return Math.round(value / place) * place
}

// Get a string with nice seconds format
Utilz.humanize_seconds = function (input, separator = ":") {
  let pad = function (input) {
    return input < 10 ? "0" + input : input
  }

  let result = [
    pad(Math.floor(input / 3600)),
    pad(Math.floor(input % 3600 / 60)),
    pad(Math.floor(input % 60)),
  ].join(separator)

  return result
}

// Replace spaces with non-brekable spaces
Utilz.nonbreak = function (s) {
  return s.trim().split(" ").join("&nbsp;")
}

// Extract extension from a string
Utilz.get_extension = function (s) {
  if (s.startsWith("http://") || s.startsWith("https://")) {
    let u = new URL(s)
    let url = u.origin + u.pathname
    let url_2 = url.split("//").slice(1).join("//")
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

  return ""
}

// Check if hex value is valid
Utilz.validate_hex = function (hex, case_sensitive = true) {
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
Utilz.get_imgur_image_code = function (src) {
  let matches = src.match(/https?\:\/\/(?:i.)?imgur.com\/(\w{7,8})(?:\.\w+)?$/)

  if (matches) {
    return matches[1].substring(0, 7)
  }
}

// Capitalize words in a sentence
Utilz.capitalize_words = function (s) {
  let ns = s.toLowerCase()
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(" ")

  return ns
}

// Make a string of nicely separated items
Utilz.nice_list = function (list) {
  let s = ""

  for (let i = 0; i < list.length; i++) {
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
Utilz.is_url = function (s) {
  if (s.startsWith("http://") || s.startsWith("https://")) {
    if (s.endsWith("]")) {
      return false
    }
    else if (s.endsWith("\"")) {
      return false
    }
    else if (s.endsWith("'")) {
      return false
    }

    return true
  }

  return false
}

// Get first url from a string
Utilz.get_first_url = function (s) {
  let split = s.split("\n")

  for (let line of split) {
    let split2 = line.split(" ")

    for (let word of split2) {
      if (word) {
        if (Utilz.is_url(word)) {
          return word
        }
      }
    }
  }

  return ""
}

Utilz.get_urls = function (s) {
  let urls = []
  let split = s.split("\n")

  for (let line of split) {
    let split2 = line.split(" ")

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
Utilz.slice_string_end = function (s, n = 10) {
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
Utilz.replace_between = function (str, start, end, what) {
  return str.substring(0, start) + what + str.substring(end)
}

// Get a nice date string
// Requires dateFormat.js
Utilz.nice_date = function (date = Date.now()) {
  return dateFormat(date, "dd/mmm/yy | h:MM:ss tt")
}

// Escape special characters
Utilz.escape_special_characters = function (s) {
  return s.replace(/[^A-Za-z0-9]/g, "\\$&")
}

// Get a string with the size in megabytes
Utilz.size_string = function (size, mode = 1) {
  if (mode === 1) {
    return `${parseFloat(size / 1024).toFixed(2)} MB`
  }
  else if (mode === 2) {
    return `${parseFloat(size / 1024 / 1024).toFixed(2)} MB`
  }
}

// Check if object is empty
Utilz.is_empty_object = function (obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object
}

// Get a nice datetime string
Utilz.nice_time = function (date1, date2) {
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
Utilz.singular_or_plural = function (n, s) {
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
Utilz.is_textbox = function (element) {
  let tag_name = element.tagName.toLowerCase()

  if (tag_name === "textarea") return true
  if (tag_name !== "input") return false

  let type = element.getAttribute("type")

  if (!type) {
    return false
  }

  let input_types = [
    "text",
    "password",
    "number",
    "email",
    "tel",
    "url",
    "search",
    "date",
    "datetime",
    "datetime-local",
    "time",
    "month",
    "week"
  ]

  return input_types.includes(type.toLowerCase())
}

// Crop a string and add ... to it
Utilz.get_limited_string = function (s, n) {
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
Utilz.make_html_safe = function (s) {
  return s.replace(/\</g, "&lt;").replace(/\>/g, "&gt;")
}

// Find the similarity between two strings
Utilz.string_similarity = function (s1, s2) {
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

  return (longer_length - Utilz.string_similarity_distance(longer, shorter)) / parseFloat(longer_length)
}

// Find the similarity distance between two strings
Utilz.string_similarity_distance = function (s1, s2) {
  s1 = s1.toLowerCase()
  s2 = s2.toLowerCase()

  let costs = new Array()

  for (let i = 0; i <= s1.length; i++) {
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
Utilz.untab_string = function (s) {
  s = s.replace(/\t/gm, "  ")
  let lines = s.split("\n")

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
  let spaces = ""

  for (let i=0; i<pos; i++) {
    spaces += " "
  }

  for (let line of lines) {
    let re = new RegExp(`(^${spaces})`)
    new_lines.push(line.replace(re, ""))
  }

  return new_lines.join("\n")
}

Utilz.MINUTE = 60000
Utilz.HOUR = 3600000
Utilz.DAY = 86400000
Utilz.YEAR = 31536000000

// Return a timeago string
Utilz.timeago = function (date) {
  let diff = Date.now() - date
  let s

  if (diff < Utilz.MINUTE) {
    s = "just now"
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
    } else {
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
Utilz.fillpad = function (s, n, c) {
  let olen = s.length

  for (let i=0; i<(n - olen); i++) {
    s = c + s
  }

  return s
}

// Get a nicely formatted time
Utilz.get_time = function () {
  let c = Utilz.time_components(new Date())
  return `${c.hours}:${c.minutes}:${c.seconds}`
}

// Show information with date
Utilz.loginfo = function (s) {
  try {
    console.info(`[${Utilz.get_time()}] ${s}`)
  } catch (err) {
    console.error(err)
  }
}

// Make a url with a parameter that prevents caching
Utilz.cache_bust_url = function (s) {
  let url = new URL(s)
  url.searchParams.set("cache-buster", Date.now())
  return url
}

// Check if file name is from an image source
Utilz.is_image = function (src) {
  let extension = Utilz.get_extension(src).toLowerCase()
  return extension && Utilz.image_extensions.includes(extension)
}

// Check if file name is from a video source
Utilz.is_video = function (src) {
  let extension = Utilz.get_extension(src).toLowerCase()
  return extension && Utilz.video_extensions.includes(extension)
}

// Check if file name is from an audio source
Utilz.is_audio = function (src) {
  let extension = Utilz.get_extension(src).toLowerCase()
  return extension && Utilz.audio_extensions.includes(extension)
}

// Check if all items in an array are equal
Utilz.bingo = function (s) {
  let split = s.split("").filter(x => x !== "")
  return new Set(split).size === 1
}

// Get date time components, hours, minutes, seconds
Utilz.time_components = function (ms) {
  let date = new Date(ms)
  let hours = Utilz.fillpad(date.getHours().toString(), 2, "0")
  let minutes = Utilz.fillpad(date.getMinutes().toString(), 2, "0")
  let seconds = Utilz.fillpad(date.getSeconds().toString(), 2, "0")
  return {hours: hours, minutes: minutes, seconds: seconds}
}

// Number range with a certain increment
Utilz.number_range = function (to, from, increment) {
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
Utilz.get_middle_item = function (arr) {
  return arr[Math.round((arr.length - 1) / 2)]
}

// Move an item in an array
Utilz.move_in_array = function (arr, from, to) {
  arr.splice(to, 0, arr.splice(from, 1)[0])
}

// Centralized function to create debouncers
Utilz.create_debouncer = function (func, delay) {
  let timer
  let obj = {}

  function clear () {
    clearTimeout(timer)
  }

  function run (...args) {
    func(...args)
  }

  obj.call = function (...args) {
    clear()

    timer = setTimeout(function () {
      run(...args)
    }, delay)
  }

  obj.now = function (...args) {
    clear()
    run(...args)
  }

  obj.cancel = function () {
    clear()
  }

  return obj
}

// Centralized function to create throttles
Utilz.create_throttle = function (func, delay) {
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

  obj.call = function (...args) {
    if ((Date.now() - last_call) > delay) {
      clear()
      run(...args)
    }
    else {
      clear()

      timer = setTimeout(function () {
        run(...args)
      }, delay)
    }
  }

  return obj
}

// Select a single element
Utilz.el = function (query, root = document) {
  return root.querySelector(query)
}

// Select an array of elements
Utilz.els = function (query, root = document) {
  return Array.from(root.querySelectorAll(query))
}

// Select a single element or self
Utilz.el_or_self = function (query, root = document) {
  let el = root.querySelector(query)

  if (!el) {
    if (root.classList.contains(query.replace(".", ""))) {
      el = root
    }
  }

  return el
}

// Select an array of elements or self
Utilz.els_or_self = function (query, root = document) {
  let els = Array.from(root.querySelectorAll(query))

  if (els.length === 0) {
    if (root.classList.contains(query.replace(".", ""))) {
      els = [root]
    }
  }

  return els
}

// Clone element
Utilz.clone = function (el) {
  return el.cloneNode(true)
}

// Clone element children
Utilz.clone_children = function (query) {
  let items = []
  let children = Array.from(Utilz.el(query).children)

  for (let c of children) {
    items.push(Utilz.clone(c))
  }

  return items
}

Utilz.dataset_obj = {}
Utilz.dataset_id = 0

// Data set manager
Utilz.dataset = function (el, value, setvalue) {
  if (!el) {
    return
  }

  let id = el.dataset.dataset_id

  if (!id) {
    id = Utilz.dataset_id
    Utilz.dataset_id += 1
    el.dataset.dataset_id = id
    Utilz.dataset_obj[id] = {}
  }

  if (setvalue !== undefined) {
    Utilz.dataset_obj[id][value] = setvalue
  }
  else {
    return Utilz.dataset_obj[id][value]
  }
}

// Create an html element
Utilz.create = function (type, classes = "", id = "") {
  let el = document.createElement(type)

  if (classes) {
    let classlist = classes.split(" ").filter(x => x != "")

    for (let cls of classlist) {
      el.classList.add(cls)
    }
  }

  if (id) {
    el.id = id
  }

  return el
}

// Add an event listener
Utilz.ev = function (element, action, callback, extra) {
  element.addEventListener(action, callback, extra)
}

// Get a random choice from a list
Utilz.random_choice = function (list) {
  return list[Utilz.get_random_int(0, list.length - 1)]
}

// Get item coords
Utilz.get_coords = function (el) {
  let rect = el.getBoundingClientRect()
  return {x: rect.left, y: rect.top}
}

// Get singular or plural
Utilz.plural = function (n, singular, plural) {
  if (n === 1) {
    return `${n.toLocaleString()} ${singular}`
  }
  else {
    return `${n.toLocaleString()} ${plural}`
  }
}

// Get singular or plural without the number
Utilz.plural_2 = function (n, singular, plural) {
  if (n === 1) {
    return singular
  }
  else {
    return plural
  }
}

// Get url hostname
Utilz.get_hostname = function (url) {
  let url_obj

  try {
    url_obj = new URL(url)
  }
  catch (err) {
    return ""
  }

  return url_obj.hostname
}

// Check if urls match
Utilz.urls_equal = function (u1, u2) {
  return Utilz.remove_slashes_end(u1) === Utilz.remove_slashes_end(u2)
}

// Remove slashes from ending
Utilz.remove_slashes_end = function (s) {
  return s.replace(/\/+$/g, "")
}

// Remove hash from url
Utilz.remove_hash = function (url) {
  return url.split("#")[0]
}

// The way to format urls
Utilz.format_url = function (url) {
  return Utilz.remove_slashes_end(Utilz.remove_hash(url))
}

// Capitalize first letter of a string
Utilz.capitalize = function (s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// Check if item's protocol is http
Utilz.is_http = function (item) {
  return item.protocol === "http:" || item.protocol === "https:"
}

// Copy text to the clipboard
Utilz.copy_to_clipboard = function (text, feedback = false) {
  navigator.clipboard.writeText(text)

  if (feedback) {
    // Show something
  }
}

// Remove protocol like https://
Utilz.remove_protocol = function (url) {
  return url.replace(/^https?:\/\//, "")
}

Utilz.media_types = ["image", "tv"]
Utilz.video_extensions = ["mp4", "webm"]
Utilz.video_types = ["video/mp4", "video/webm"]
Utilz.audio_extensions = ["mp3", "ogg", "wav", "flac"]
Utilz.audio_types = ["audio/mpeg", "audio/ogg", "audio/wav", "audio/flac"]
Utilz.image_extensions = ["jpg", "jpeg", "png", "gif", "webp", "bmp"]
Utilz.image_types = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/bmp"]