import * as Yup from 'yup'

export const DISCORD_BUTTONS_COLORS = [
  { color: '#5865f2', name: 'Primary', value: 1 },
  { color: '#4e545d', name: 'Secondary', value: 2 },
  { color: '#42b581', name: 'Success', value: 3 },
  { color: '#f04847', name: 'Danger', value: 4 }
]

const REACT_SELECT_GLOBAL_STYLES = {
  indicatorsContainer: (base) => ({
    ...base,
    '.formselect__clear-indicator:hover': {
      color: 'var(--red)',
      transition: 'color 0.2s'
    }
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 })
}

export const CHANNELS_STYLES = {
  ...REACT_SELECT_GLOBAL_STYLES,
  multiValue: (base, state) => ({
    ...base,
    alignItems: 'center'
  }),
  multiValueRemove: (styles, { data }) => {
    if (data.isFixed) return { ...styles, display: 'none' }
    return {
      ...styles,
      backgroundColor: 'transpernt',
      marginInlineStart: '5px',
      borderRadius: '50%',
      transition: 'all 0.2s',
      width: '12px',
      height: '12px',
      padding: 0,
      order: 1,
      svg: {
        flex: 1,
        height: 13
      },
      ':hover': {
        backgroundColor: 'var(--red)'
      }
    }
  }
}

export const ROLES_STYLES = {
  ...REACT_SELECT_GLOBAL_STYLES,
  option: (base, state) => ({
    ...base,
    alignItems: 'center',
    display: 'flex',

    ':before': {
      backgroundColor: state.data.color,
      borderRadius: 10,
      content: '" "',
      display: 'block',
      marginRight: 8,
      height: 10,
      width: 10
    }
  }),
  multiValue: (base, state) => ({
    ...base,
    display: 'flex',
    alignItems: 'center',
    padding: '0 5px',
    gap: 1
  }),
  multiValueRemove: (base, state) => ({
    ...base,
    backgroundColor: state.data.color,
    borderRadius: '50%',
    transition: 'all 0.2s',
    width: '12px',
    height: '12px',
    padding: 0,
    order: 1,
    svg: {
      flex: 1,
      height: 13,
      opacity: 0
    },
    ':hover': {
      backgroundColor: state.data.color,
      svg: {
        opacity: 1
      }
    }
  })
}

export const SINGLE_EMBED_SCHEMA = Yup.object().shape({
  title: Yup.string().when(
    ['description', 'author', 'footer', 'image', 'thumbnail', 'fields'],
    {
      is: (description, author, footer, image, thumbnail, fields) =>
        !description &&
        !author?.name &&
        !author?.icon_url &&
        !author?.url &&
        !footer?.text &&
        !footer?.icon_url &&
        !image?.url &&
        !thumbnail?.url &&
        !fields?.length,
      then: Yup.string().required('required')
    }
  ),
  description: Yup.string().max(4096, 'Too Long!'),
  author: Yup.object().shape({
    name: Yup.string().max(256, 'Too Long!'),
    icon_url: Yup.string(),
    url: Yup.string()
  }),
  footer: Yup.object().shape({
    text: Yup.string().max(2048, 'Too Long!'),
    icon_url: Yup.string()
  }),
  image: Yup.object().shape({
    url: Yup.string()
  }),
  thumbnail: Yup.object().shape({
    url: Yup.string()
  }),
  color: Yup.number(),
  fields: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().max(256, 'Too Long!'),
      value: Yup.string().max(1024, 'Too Long!'),
      inline: Yup.boolean()
    })
  )
})

export const INITIAL_EMBED_DATA = {
  type: 'embed',
  content: '',
  embed: {
    title: '',
    description: '',
    author: {
      name: '',
      icon_url: '',
      url: ''
    },
    url: '',
    image: {
      url: ''
    },
    thumbnail: {
      url: ''
    },
    color: 5793266,
    footer: {
      text: '',
      icon_url: ''
    },
    fields: []
  }
}

export const WELCOMER_INITIAL_DATA = {
  welcome_background: '',
  avatar_type: 'circle',
  welcome_avatar_left: 145.59375,
  welcome_avatar_top: 9,
  welcome_avatar_w: 90.99999999999997,
  welcome_avatar_h: 83,
  welcome_name_color: '#FFFFFF',
  welcome_name_left: 115,
  welcome_name_top: 97,
  welcome_name_size: 17.733333333333334,
  welcome_name_w: 152.0594262295082,
  textAlign: 'center',
  welcome_name_shadowOffset: { x: 2, y: 2 },
  welcome_name_shadowColor: '#000',
  welcome_avatar_rotation: 0,
  textMsg: null,
  textSendTo: 0,
  textEnable: false,
  designEnable: false,
  designSendTo: 0,
  backgroundType: 'transparent',
  Transparent: { width: 400, height: 200 },
  welcome_text: 'Welcome to Our server',
  welcome_text_enable: 1,
  welcome_text_left: 113.34375,
  welcome_text_top: 117.203125,
  welcome_text_size: 15.796874999999993,
  welcome_text_color: '#FFFFFF',
  welcome_text_w: 166,
  welcome_text_h: 0,
  welcome_text_rotation: 0,
  welcome_name_h: -15,
  autoroleEnable: false,
  autoroleID: null,
  leaveMessage: {
    enabled: false,
    content: ''
  }
}

export const WELCOMER_TEMPLATES = [
  {
    backgroundType: 'image',
    welcome_background: 'https://probot.media/yXRc3xD98V.png',
    avatar_type: 'circle',
    welcome_avatar_h: 78,
    welcome_avatar_w: 78,
    welcome_avatar_left: '107.6',
    welcome_avatar_top: '56.9',
    textAlign: 'center',
    welcome_name_color: '#FFFFFF',
    welcome_name_size: '24.73',
    welcome_name_left: '139.00',
    welcome_name_top: '74.99',
    welcome_name_w: '199.06',
    welcome_name_h: '0',
    welcome_text_enable: 1,
    welcome_text: 'WELCOME TO OUR SERVER!',
    welcome_text_color: '#CAC9C9',
    welcome_text_h: 0,
    welcome_text_left: '180.34',
    welcome_text_rotation: 0,
    welcome_text_size: '13.80',
    welcome_text_top: '110.20',
    welcome_text_w: '236.00'
  },
  {
    backgroundType: 'image',
    welcome_background: 'https://probot.media/UIODnfcGwa.png',
    avatar_type: 'circle',
    welcome_avatar_h: 78,
    welcome_avatar_w: 78,
    welcome_avatar_left: '212.59',
    welcome_avatar_top: '10',
    textAlign: 'center',
    welcome_name_color: '#FFFFFF',
    welcome_name_size: '22.73',
    welcome_name_left: '152.00',
    welcome_name_top: '107.99',
    welcome_name_w: '199.06',
    welcome_name_h: '0',
    welcome_text_enable: 1,
    welcome_text: 'WELCOME TO OUR SERVER!',
    welcome_text_color: '#757575',
    welcome_text_h: 0,
    welcome_text_left: '140.34',
    welcome_text_rotation: 0,
    welcome_text_size: '14.80',
    welcome_text_top: '145.20',
    welcome_text_w: '231.00'
  },
  {
    backgroundType: 'image',
    welcome_background: 'https://probot.media/QndRDPDyE1.png',
    avatar_type: 'square',
    welcome_avatar_h: 78,
    welcome_avatar_w: 78,
    welcome_avatar_left: '16.59',
    welcome_avatar_top: '66.00',
    textAlign: 'center',
    welcome_name_color: '#FFFFFF',
    welcome_name_size: '21.73',
    welcome_name_left: '93.00',
    welcome_name_top: '84.99',
    welcome_name_w: '199.06',
    welcome_name_h: '0',
    welcome_text_enable: 1,
    welcome_text: 'Welcome to Our Server!',
    welcome_text_color: '#CDCDCD',
    welcome_text_h: 0,
    welcome_text_left: '145.34',
    welcome_text_rotation: 0,
    welcome_text_size: '19.80',
    welcome_text_top: '119.20',
    welcome_text_w: '231.00'
  },
  {
    backgroundType: 'image',
    welcome_background: 'https://probot.media/tZFvtyOXuC.png',
    avatar_type: 'circle',
    welcome_avatar_h: 92,
    welcome_avatar_w: 92,
    welcome_avatar_left: '14.59',
    welcome_avatar_top: '15',
    textAlign: 'center',
    welcome_name_color: '#FFFFFF',
    welcome_name_size: '24.73',
    welcome_name_left: '81.00',
    welcome_name_top: '61.99',
    welcome_name_w: '199.06',
    welcome_name_h: '0',
    welcome_text_enable: 1,
    welcome_text: 'Welcome to Our Server!',
    welcome_text_color: '#CDCDCD',
    welcome_text_h: 0,
    welcome_text_left: '130.34',
    welcome_text_rotation: 0,
    welcome_text_size: '19.80',
    welcome_text_top: '98.20',
    welcome_text_w: '231.00'
  }
]

export const COUNTRIES = [
  { name: 'Afghanistan', code: 'af' },
  { name: 'Åland Islands', code: 'ax' },
  { name: 'Albania', code: 'al' },
  { name: 'Algeria', code: 'dz' },
  { name: 'American Samoa', code: 'as' },
  { name: 'AndorrA', code: 'ad' },
  { name: 'Angola', code: 'ao' },
  { name: 'Anguilla', code: 'ai' },
  { name: 'Antarctica', code: 'aq' },
  { name: 'Antigua and Barbuda', code: 'ag' },
  { name: 'Argentina', code: 'ar' },
  { name: 'Armenia', code: 'am' },
  { name: 'Aruba', code: 'aw' },
  { name: 'Australia', code: 'au' },
  { name: 'Austria', code: 'at' },
  { name: 'Azerbaijan', code: 'az' },
  { name: 'Bahamas', code: 'bs' },
  { name: 'Bahrain', code: 'bh' },
  { name: 'Bangladesh', code: 'bd' },
  { name: 'Barbados', code: 'bb' },
  { name: 'Belarus', code: 'by' },
  { name: 'Belgium', code: 'be' },
  { name: 'Belize', code: 'bz' },
  { name: 'Benin', code: 'bj' },
  { name: 'Bermuda', code: 'bm' },
  { name: 'Bhutan', code: 'bt' },
  { name: 'Bolivia', code: 'bo' },
  { name: 'Bosnia and Herzegovina', code: 'ba' },
  { name: 'Botswana', code: 'bw' },
  { name: 'Bouvet Island', code: 'bv' },
  { name: 'Brazil', code: 'br' },
  { name: 'British Indian Ocean Territory', code: 'io' },
  { name: 'Brunei Darussalam', code: 'bn' },
  { name: 'Bulgaria', code: 'bg' },
  { name: 'Burkina Faso', code: 'bf' },
  { name: 'Burundi', code: 'bi' },
  { name: 'Cambodia', code: 'kh' },
  { name: 'Cameroon', code: 'cm' },
  { name: 'Canada', code: 'ca' },
  { name: 'Cape Verde', code: 'cv' },
  { name: 'Cayman Islands', code: 'ky' },
  { name: 'Central African Republic', code: 'cf' },
  { name: 'Chad', code: 'td' },
  { name: 'Chile', code: 'cl' },
  { name: 'China', code: 'cn' },
  { name: 'Christmas Island', code: 'cx' },
  { name: 'Cocos (Keeling) Islands', code: 'cc' },
  { name: 'Colombia', code: 'co' },
  { name: 'Comoros', code: 'km' },
  { name: 'Congo', code: 'cg' },
  { name: 'Congo, The Democratic Republic of the', code: 'cd' },
  { name: 'Cook Islands', code: 'ck' },
  { name: 'Costa Rica', code: 'cr' },
  { name: "Cote D'Ivoire", code: 'ci' },
  { name: 'Croatia', code: 'hr' },
  { name: 'Cuba', code: 'cu' },
  { name: 'Cyprus', code: 'cy' },
  { name: 'Czech Republic', code: 'cz' },
  { name: 'Denmark', code: 'dk' },
  { name: 'Djibouti', code: 'dj' },
  { name: 'Dominica', code: 'dm' },
  { name: 'Dominican Republic', code: 'do' },
  { name: 'Ecuador', code: 'ec' },
  { name: 'Egypt', code: 'eg' },
  { name: 'El Salvador', code: 'sv' },
  { name: 'Equatorial Guinea', code: 'gq' },
  { name: 'Eritrea', code: 'er' },
  { name: 'Estonia', code: 'ee' },
  { name: 'Ethiopia', code: 'et' },
  { name: 'Falkland Islands (Malvinas)', code: 'fk' },
  { name: 'Faroe Islands', code: 'fo' },
  { name: 'Fiji', code: 'fj' },
  { name: 'Finland', code: 'fi' },
  { name: 'France', code: 'fr' },
  { name: 'French Guiana', code: 'gf' },
  { name: 'French Polynesia', code: 'pf' },
  { name: 'French Southern Territories', code: 'tf' },
  { name: 'Gabon', code: 'ga' },
  { name: 'Gambia', code: 'gm' },
  { name: 'Georgia', code: 'ge' },
  { name: 'Germany', code: 'de' },
  { name: 'Ghana', code: 'gh' },
  { name: 'Gibraltar', code: 'gi' },
  { name: 'Greece', code: 'gr' },
  { name: 'Greenland', code: 'gl' },
  { name: 'Grenada', code: 'gd' },
  { name: 'Guadeloupe', code: 'gp' },
  { name: 'Guam', code: 'gu' },
  { name: 'Guatemala', code: 'gt' },
  { name: 'Guernsey', code: 'gg' },
  { name: 'Guinea', code: 'gn' },
  { name: 'Guinea-Bissau', code: 'gw' },
  { name: 'Guyana', code: 'gy' },
  { name: 'Haiti', code: 'ht' },
  { name: 'Heard Island and Mcdonald Islands', code: 'hm' },
  { name: 'Holy See (Vatican City State)', code: 'va' },
  { name: 'Honduras', code: 'hn' },
  { name: 'Hong Kong', code: 'hk' },
  { name: 'Hungary', code: 'hu' },
  { name: 'Iceland', code: 'is' },
  { name: 'India', code: 'in' },
  { name: 'Indonesia', code: 'id' },
  { name: 'Iran, Islamic Republic Of', code: 'ir' },
  { name: 'Iraq', code: 'iq' },
  { name: 'Ireland', code: 'ie' },
  { name: 'Isle of Man', code: 'im' },
  { name: 'Israel', code: 'il' },
  { name: 'Italy', code: 'it' },
  { name: 'Jamaica', code: 'jm' },
  { name: 'Japan', code: 'jp' },
  { name: 'Jersey', code: 'je' },
  { name: 'Jordan', code: 'jo' },
  { name: 'Kazakhstan', code: 'kz' },
  { name: 'Kenya', code: 'ke' },
  { name: 'Kiribati', code: 'ki' },
  { name: "Korea, Democratic People'S Republic of", code: 'kp' },
  { name: 'Korea, Republic of', code: 'kr' },
  { name: 'Kuwait', code: 'kw' },
  { name: 'Kyrgyzstan', code: 'kg' },
  { name: "Lao People'S Democratic Republic", code: 'la' },
  { name: 'Latvia', code: 'lv' },
  { name: 'Lebanon', code: 'lb' },
  { name: 'Lesotho', code: 'ls' },
  { name: 'Liberia', code: 'lr' },
  { name: 'Libyan Arab Jamahiriya', code: 'ly' },
  { name: 'Liechtenstein', code: 'li' },
  { name: 'Lithuania', code: 'lt' },
  { name: 'Luxembourg', code: 'lu' },
  { name: 'Macao', code: 'mo' },
  { name: 'Macedonia, The Former Yugoslav Republic of', code: 'mk' },
  { name: 'Madagascar', code: 'mg' },
  { name: 'Malawi', code: 'mw' },
  { name: 'Malaysia', code: 'my' },
  { name: 'Maldives', code: 'mv' },
  { name: 'Mali', code: 'ml' },
  { name: 'Malta', code: 'mt' },
  { name: 'Marshall Islands', code: 'mh' },
  { name: 'Martinique', code: 'mq' },
  { name: 'Mauritania', code: 'mr' },
  { name: 'Mauritius', code: 'mu' },
  { name: 'Mayotte', code: 'yt' },
  { name: 'Mexico', code: 'mx' },
  { name: 'Micronesia, Federated States of', code: 'fm' },
  { name: 'Moldova, Republic of', code: 'md' },
  { name: 'Monaco', code: 'mc' },
  { name: 'Mongolia', code: 'mn' },
  { name: 'Montserrat', code: 'ms' },
  { name: 'Morocco', code: 'ma' },
  { name: 'Mozambique', code: 'mz' },
  { name: 'Myanmar', code: 'mm' },
  { name: 'Namibia', code: 'na' },
  { name: 'Nauru', code: 'nr' },
  { name: 'Nepal', code: 'np' },
  { name: 'Netherlands', code: 'nl' },
  { name: 'Netherlands Antilles', code: 'an' },
  { name: 'New Caledonia', code: 'nc' },
  { name: 'New Zealand', code: 'nz' },
  { name: 'Nicaragua', code: 'ni' },
  { name: 'Niger', code: 'ne' },
  { name: 'Nigeria', code: 'ng' },
  { name: 'Niue', code: 'nu' },
  { name: 'Norfolk Island', code: 'nf' },
  { name: 'Northern Mariana Islands', code: 'mp' },
  { name: 'Norway', code: 'no' },
  { name: 'Oman', code: 'om' },
  { name: 'Pakistan', code: 'pk' },
  { name: 'Palau', code: 'pw' },
  { name: 'Palestinian Territory, Occupied', code: 'ps' },
  { name: 'Panama', code: 'pa' },
  { name: 'Papua New Guinea', code: 'pg' },
  { name: 'Paraguay', code: 'py' },
  { name: 'Peru', code: 'pe' },
  { name: 'Philippines', code: 'ph' },
  { name: 'Pitcairn', code: 'pn' },
  { name: 'Poland', code: 'pl' },
  { name: 'Portugal', code: 'pt' },
  { name: 'Puerto Rico', code: 'pr' },
  { name: 'Qatar', code: 'qa' },
  { name: 'Reunion', code: 're' },
  { name: 'Romania', code: 'ro' },
  { name: 'Russian Federation', code: 'ru' },
  { name: 'RWANDA', code: 'rw' },
  { name: 'Saint Helena', code: 'sh' },
  { name: 'Saint Kitts and Nevis', code: 'kn' },
  { name: 'Saint Lucia', code: 'lc' },
  { name: 'Saint Pierre and Miquelon', code: 'pm' },
  { name: 'Saint Vincent and the Grenadines', code: 'vc' },
  { name: 'Samoa', code: 'ws' },
  { name: 'San Marino', code: 'sm' },
  { name: 'Sao Tome and Principe', code: 'st' },
  { name: 'Saudi Arabia', code: 'sa' },
  { name: 'Senegal', code: 'sn' },
  { name: 'Serbia and Montenegro', code: 'cs' },
  { name: 'Seychelles', code: 'sc' },
  { name: 'Sierra Leone', code: 'sl' },
  { name: 'Singapore', code: 'sg' },
  { name: 'Slovakia', code: 'sk' },
  { name: 'Slovenia', code: 'si' },
  { name: 'Solomon Islands', code: 'sb' },
  { name: 'Somalia', code: 'so' },
  { name: 'South Africa', code: 'za' },
  { name: 'South Georgia and the South Sandwich Islands', code: 'gs' },
  { name: 'Spain', code: 'es' },
  { name: 'Sri Lanka', code: 'lk' },
  { name: 'Sudan', code: 'sd' },
  { name: 'Suriname', code: 'sr' },
  { name: 'Svalbard and Jan Mayen', code: 'sj' },
  { name: 'Swaziland', code: 'sz' },
  { name: 'Sweden', code: 'se' },
  { name: 'Switzerland', code: 'ch' },
  { name: 'Syrian Arab Republic', code: 'sy' },
  { name: 'Taiwan, Province of China', code: 'tw' },
  { name: 'Tajikistan', code: 'TJ' },
  { name: 'Tanzania, United Republic of', code: 'tz' },
  { name: 'Thailand', code: 'th' },
  { name: 'Timor-Leste', code: 'tl' },
  { name: 'Togo', code: 'tg' },
  { name: 'Tokelau', code: 'tk' },
  { name: 'Tonga', code: 'to' },
  { name: 'Trinidad and Tobago', code: 'tt' },
  { name: 'Tunisia', code: 'tn' },
  { name: 'Turkey', code: 'tr' },
  { name: 'Turkmenistan', code: 'tm' },
  { name: 'Turks and Caicos Islands', code: 'tc' },
  { name: 'Tuvalu', code: 'tv' },
  { name: 'Uganda', code: 'uh' },
  { name: 'Ukraine', code: 'ua' },
  { name: 'United Arab Emirates', code: 'ae' },
  { name: 'United Kingdom', code: 'gb' },
  { name: 'United States', code: 'us' },
  { name: 'United States Minor Outlying Islands', code: 'um' },
  { name: 'Uruguay', code: 'uy' },
  { name: 'Uzbekistan', code: 'uz' },
  { name: 'Vanuatu', code: 'vu' },
  { name: 'Venezuela', code: 've' },
  { name: 'Viet Nam', code: 'vn' },
  { name: 'Virgin Islands, British', code: 'vg' },
  { name: 'Virgin Islands, U.S.', code: 'vi' },
  { name: 'Wallis and Futuna', code: 'wf' },
  { name: 'Western Sahara', code: 'eh' },
  { name: 'Yemen', code: 'ye' },
  { name: 'Zambia', code: 'zm' },
  { name: 'Zimbabwe', code: 'zw' }
]

export const AUTOMOD_CARD_ICON = {
  AUTOMOD_SPAM: (
    <svg
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.4"
        d="M16.6667 2.12H8.66666C4.66666 2.12 2.66666 4.12 2.66666 8.12V21.12C2.66666 21.67 3.11666 22.12 3.66666 22.12H16.6667C20.6667 22.12 22.6667 20.12 22.6667 16.12V8.12C22.6667 4.12 20.6667 2.12 16.6667 2.12Z"
        fill="#9292A0"
      />
      <path
        d="M17.6667 8.87H7.66666C7.25666 8.87 6.91666 9.21 6.91666 9.62C6.91666 10.03 7.25666 10.37 7.66666 10.37H17.6667C18.0767 10.37 18.4167 10.03 18.4167 9.62C18.4167 9.21 18.0767 8.87 17.6667 8.87Z"
        fill="#9292A0"
      />
      <path
        d="M14.6667 13.87H7.66666C7.25666 13.87 6.91666 14.21 6.91666 14.62C6.91666 15.03 7.25666 15.37 7.66666 15.37H14.6667C15.0767 15.37 15.4167 15.03 15.4167 14.62C15.4167 14.21 15.0767 13.87 14.6667 13.87Z"
        fill="#9292A0"
      />
    </svg>
  ),
  AUTOMOD_BADWORDS: (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.4"
        d="M10.75 2.56999C11.45 1.97999 12.58 1.97999 13.26 2.56999L14.84 3.91999C15.14 4.16999 15.71 4.37999 16.11 4.37999H17.81C18.87 4.37999 19.74 5.24999 19.74 6.30999V8.00999C19.74 8.40999 19.95 8.96999 20.2 9.26999L21.55 10.85C22.14 11.55 22.14 12.68 21.55 13.36L20.2 14.94C19.95 15.24 19.74 15.8 19.74 16.2V17.9C19.74 18.96 18.87 19.83 17.81 19.83H16.11C15.71 19.83 15.15 20.04 14.85 20.29L13.27 21.64C12.57 22.23 11.44 22.23 10.76 21.64L9.18001 20.29C8.88 20.04 8.31 19.83 7.92 19.83H6.17C5.11 19.83 4.24 18.96 4.24 17.9V16.19C4.24 15.8 4.04 15.23 3.79 14.94L2.44 13.35C1.86 12.66 1.86 11.54 2.44 10.85L3.79 9.25999C4.04 8.95999 4.24 8.39999 4.24 8.00999V6.31999C4.24 5.25999 5.11 4.38999 6.17 4.38999H7.9C8.3 4.38999 8.86 4.17999 9.16 3.92999L10.75 2.56999Z"
        fill="#9292A0"
      />
      <path
        d="M12 16.99C11.45 16.99 11 16.54 11 15.99C11 15.44 11.44 14.99 12 14.99C12.55 14.99 13 15.44 13 15.99C13 16.54 12.56 16.99 12 16.99Z"
        fill="#9292A0"
      />
      <path
        d="M12 13.84C11.59 13.84 11.25 13.5 11.25 13.09V8.24999C11.25 7.83999 11.59 7.49999 12 7.49999C12.41 7.49999 12.75 7.83999 12.75 8.24999V13.08C12.75 13.5 12.42 13.84 12 13.84Z"
        fill="#9292A0"
      />
    </svg>
  ),
  AUTOMOD_DUPS: (
    <svg
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.4"
        d="M18.8033 16.95L19.1933 20.11C19.2933 20.94 18.4033 21.52 17.6933 21.09L13.5033 18.6C13.0433 18.6 12.5933 18.57 12.1533 18.51C12.8933 17.64 13.3333 16.54 13.3333 15.35C13.3333 12.51 10.8733 10.21 7.83331 10.21C6.67331 10.21 5.60332 10.54 4.71332 11.12C4.68332 10.87 4.67331 10.62 4.67331 10.36C4.67331 5.80999 8.62331 2.12 13.5033 2.12C18.3833 2.12 22.3333 5.80999 22.3333 10.36C22.3333 13.06 20.9433 15.45 18.8033 16.95Z"
        fill="#9292A0"
      />
      <path
        d="M13.3333 15.35C13.3333 16.54 12.8933 17.64 12.1533 18.51C11.1633 19.71 9.59331 20.48 7.83331 20.48L5.22331 22.03C4.78331 22.3 4.22331 21.93 4.28331 21.42L4.53331 19.45C3.19331 18.52 2.33331 17.03 2.33331 15.35C2.33331 13.59 3.27332 12.04 4.71332 11.12C5.60332 10.54 6.67331 10.21 7.83331 10.21C10.8733 10.21 13.3333 12.51 13.3333 15.35Z"
        fill="#9292A0"
      />
    </svg>
  ),
  AUTOMOD_REPEATED: (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.4"
        d="M20 8.37V18.12C20 21.12 18.21 22.12 16 22.12H8C5.79 22.12 4 21.12 4 18.12V8.37C4 5.12 5.79 4.37 8 4.37C8 4.99 8.24997 5.54999 8.65997 5.95999C9.06997 6.36999 9.63 6.62 10.25 6.62H13.75C14.99 6.62 16 5.61 16 4.37C18.21 4.37 20 5.12 20 8.37Z"
        fill="#9292A0"
      />
      <path
        d="M16 4.37C16 5.61 14.99 6.62 13.75 6.62H10.25C9.63 6.62 9.06997 6.36999 8.65997 5.95999C8.24997 5.54999 8 4.99 8 4.37C8 3.13 9.01 2.12 10.25 2.12H13.75C14.37 2.12 14.93 2.37 15.34 2.78C15.75 3.19 16 3.75 16 4.37Z"
        fill="#9292A0"
      />
      <path
        d="M12 13.87H8C7.59 13.87 7.25 13.53 7.25 13.12C7.25 12.71 7.59 12.37 8 12.37H12C12.41 12.37 12.75 12.71 12.75 13.12C12.75 13.53 12.41 13.87 12 13.87Z"
        fill="#9292A0"
      />
      <path
        d="M16 17.87H8C7.59 17.87 7.25 17.53 7.25 17.12C7.25 16.71 7.59 16.37 8 16.37H16C16.41 16.37 16.75 16.71 16.75 17.12C16.75 17.53 16.41 17.87 16 17.87Z"
        fill="#9292A0"
      />
    </svg>
  ),
  AUTOMOD_DISCORD_INVITES: (
    <svg
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.4"
        d="M11.3333 7.62V16.62C11.3333 17.17 10.8833 17.62 10.3333 17.62H7.83334C6.31334 17.62 4.94334 17 3.94334 16.01C3.00334 15.06 2.39334 13.77 2.33334 12.34C2.21334 9.2 4.95334 6.62 8.10334 6.62H10.3333C10.8833 6.62 11.3333 7.07 11.3333 7.62Z"
        fill="#9292A0"
      />
      <path
        opacity="0.4"
        d="M22.3333 11.9C22.4633 15.05 19.7233 17.62 16.5733 17.62H14.3433C13.7933 17.62 13.3433 17.17 13.3433 16.62V7.62C13.3433 7.07 13.7933 6.62 14.3433 6.62H16.8433C18.3633 6.62 19.7333 7.23999 20.7333 8.22999C21.6633 9.17999 22.2733 10.47 22.3333 11.9Z"
        fill="#9292A0"
      />
      <path
        d="M16.3333 12.87H8.33334C7.92334 12.87 7.58334 12.53 7.58334 12.12C7.58334 11.71 7.92334 11.37 8.33334 11.37H16.3333C16.7433 11.37 17.0833 11.71 17.0833 12.12C17.0833 12.53 16.7433 12.87 16.3333 12.87Z"
        fill="#9292A0"
      />
    </svg>
  ),
  AUTOMOD_LINKS: (
    <svg
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.4"
        d="M11.3333 7.62V16.62C11.3333 17.17 10.8833 17.62 10.3333 17.62H7.83334C6.31334 17.62 4.94334 17 3.94334 16.01C3.00334 15.06 2.39334 13.77 2.33334 12.34C2.21334 9.2 4.95334 6.62 8.10334 6.62H10.3333C10.8833 6.62 11.3333 7.07 11.3333 7.62Z"
        fill="#9292A0"
      />
      <path
        opacity="0.4"
        d="M22.3333 11.9C22.4633 15.05 19.7233 17.62 16.5733 17.62H14.3433C13.7933 17.62 13.3433 17.17 13.3433 16.62V7.62C13.3433 7.07 13.7933 6.62 14.3433 6.62H16.8433C18.3633 6.62 19.7333 7.23999 20.7333 8.22999C21.6633 9.17999 22.2733 10.47 22.3333 11.9Z"
        fill="#9292A0"
      />
      <path
        d="M16.3333 12.87H8.33334C7.92334 12.87 7.58334 12.53 7.58334 12.12C7.58334 11.71 7.92334 11.37 8.33334 11.37H16.3333C16.7433 11.37 17.0833 11.71 17.0833 12.12C17.0833 12.53 16.7433 12.87 16.3333 12.87Z"
        fill="#9292A0"
      />
    </svg>
  ),
  AUTOMOD_CAPS: (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.4"
        d="M22 7.93V16.31C22 19.95 19.83 22.12 16.19 22.12H7.81C7.61 22.12 7.41 22.11 7.22 22.1C5.99 22.02 4.95 21.67 4.13 21.07C3.71 20.78 3.34 20.41 3.05 19.99C2.36 19.04 2 17.8 2 16.31V7.93C2 4.49 3.94 2.36 7.22 2.15C7.41 2.13 7.61 2.12 7.81 2.12H16.19C17.68 2.12 18.92 2.48 19.87 3.17C20.29 3.46 20.66 3.83 20.95 4.25C21.64 5.2 22 6.43999 22 7.93Z"
        fill="#9292A0"
      />
      <path
        d="M15.03 11.61C15.63 10.95 16 10.08 16 9.12C16 7.05 14.32 5.37 12.25 5.37H9.01C7.9 5.37 7 6.27 7 7.38V16.86C7 17.97 7.9 18.87 9.01 18.87H13.75C15.82 18.87 17.5 17.19 17.5 15.12C17.5 13.5 16.47 12.14 15.03 11.61ZM8.5 7.38C8.5 7.1 8.73 6.87 9.01 6.87H12.25C13.49 6.87 14.5 7.88 14.5 9.12C14.5 10.36 13.49 11.37 12.25 11.37H8.5V7.38ZM13.75 17.37H9.01C8.73 17.37 8.5 17.14 8.5 16.86V12.87H13.75C14.99 12.87 16 13.88 16 15.12C16 16.36 14.99 17.37 13.75 17.37Z"
        fill="#9292A0"
      />
    </svg>
  ),
  AUTOMOD_EMOJI_SPAM: (
    <svg
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.4"
        d="M16.5233 2.12H8.14334C4.50334 2.12 2.33334 4.28999 2.33334 7.93V16.3C2.33334 19.95 4.50334 22.12 8.14334 22.12H16.5133C20.1533 22.12 22.3233 19.95 22.3233 16.31V7.93C22.3333 4.28999 20.1633 2.12 16.5233 2.12Z"
        fill="#9292A0"
      />
      <path
        d="M9.15335 9.87C8.30335 9.87 7.45335 9.55 6.80335 8.9C6.51335 8.61 6.51335 8.13 6.80335 7.84C7.09335 7.55 7.57335 7.55 7.86335 7.84C8.57335 8.55 9.73335 8.55 10.4433 7.84C10.7333 7.55 11.2133 7.55 11.5033 7.84C11.7933 8.13 11.7933 8.61 11.5033 8.9C10.8533 9.54 10.0033 9.87 9.15335 9.87Z"
        fill="#9292A0"
      />
      <path
        d="M15.5133 9.87C14.6633 9.87 13.8133 9.55 13.1633 8.9C12.8733 8.61 12.8733 8.13 13.1633 7.84C13.4533 7.55 13.9333 7.55 14.2233 7.84C14.9333 8.55 16.0933 8.55 16.8033 7.84C17.0933 7.55 17.5733 7.55 17.8633 7.84C18.1533 8.13 18.1533 8.61 17.8633 8.9C17.2133 9.54 16.3633 9.87 15.5133 9.87Z"
        fill="#9292A0"
      />
      <path
        d="M15.9333 12.74H8.73335C8.03335 12.74 7.46335 13.31 7.46335 14.02C7.46335 16.71 9.65335 18.9 12.3433 18.9C15.0333 18.9 17.2233 16.71 17.2233 14.02C17.2133 13.32 16.6333 12.74 15.9333 12.74Z"
        fill="#9292A0"
      />
    </svg>
  ),
  AUTOMOD_MASS_MENTION: (
    <svg
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20.6667 6.87C22.1855 6.87 23.4167 5.63878 23.4167 4.12C23.4167 2.60121 22.1855 1.37 20.6667 1.37C19.1479 1.37 17.9167 2.60121 17.9167 4.12C17.9167 5.63878 19.1479 6.87 20.6667 6.87Z"
        fill="#9292A0"
      />
      <path
        opacity="0.4"
        d="M20.6667 8.12C18.4567 8.12 16.6667 6.33 16.6667 4.12C16.6667 3.39 16.8767 2.71 17.2267 2.12H7.66669C4.90669 2.12 2.66669 4.35 2.66669 7.1V13.08V14.08C2.66669 16.83 4.90669 19.06 7.66669 19.06H9.16669C9.43669 19.06 9.79669 19.24 9.96669 19.46L11.4667 21.45C12.1267 22.33 13.2067 22.33 13.8667 21.45L15.3667 19.46C15.5567 19.21 15.8567 19.06 16.1667 19.06H17.6667C20.4267 19.06 22.6667 16.83 22.6667 14.08V7.56C22.0767 7.91 21.3967 8.12 20.6667 8.12Z"
        fill="#9292A0"
      />
      <path
        d="M12.6667 12.12C12.1067 12.12 11.6667 11.67 11.6667 11.12C11.6667 10.57 12.1167 10.12 12.6667 10.12C13.2167 10.12 13.6667 10.57 13.6667 11.12C13.6667 11.67 13.2267 12.12 12.6667 12.12Z"
        fill="#9292A0"
      />
      <path
        d="M16.6667 12.12C16.1067 12.12 15.6667 11.67 15.6667 11.12C15.6667 10.57 16.1167 10.12 16.6667 10.12C17.2167 10.12 17.6667 10.57 17.6667 11.12C17.6667 11.67 17.2267 12.12 16.6667 12.12Z"
        fill="#9292A0"
      />
      <path
        d="M8.66669 12.12C8.10669 12.12 7.66669 11.67 7.66669 11.12C7.66669 10.57 8.11669 10.12 8.66669 10.12C9.21669 10.12 9.66669 10.57 9.66669 11.12C9.66669 11.67 9.22669 12.12 8.66669 12.12Z"
        fill="#9292A0"
      />
    </svg>
  )
}

export const shop = [
  {
    id: 1,
    price: { 2: 30.0, 1: 5.0 }
  },
  {
    id: 2,
    price: { 2: 60.0, 1: 10.0 }
  },
  {
    id: 1001,
    price: { 2: 30.0, 1: 5.0 }
  },
  {
    id: 1002,
    price: { 2: 60.0, 1: 10.0 }
  },
  {
    id: 1003,
    price: { 2: 180.0, 1: 30.0 }
  }
]
