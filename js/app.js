const ENDPOINT_URL = "https://script.google.com/macros/s/AKfycbwkCZgIRU5X0TPb7gfUku8gj7cTvxtYftjdhh4q0d4r_1BMXaupuzQeAsEspMnUpL5D/exec";

(function () {
  const form = document.getElementById("filtro-form");
  if (!form) return;

  const submitBtn = form.querySelector("button[type='submit']");
  const originalBtnText = submitBtn ? submitBtn.textContent : "Enviar";
  const prefijoHidden = document.getElementById('prefijo');
  const prefixBtn = document.getElementById('prefixBtn');
  const prefixList = document.getElementById('prefixList');
  const phoneInput = document.getElementById('telefono');
  const nameInput = document.getElementById('nombre');
  const emailInput = document.getElementById('email');
  const locationInput = document.getElementById('ubicacion');
  const statusEl = document.getElementById('status');
  let prefixSearchInput = null;
  // Autocompletado eliminado: el campo 'ubicacion' queda manual
  const commentsInput = document.getElementById('comentarios');

  // Lista de prefijos con bandera (resumen amplio y práctico)
  const DIAL_CODES = [
    { name: 'España', code: 'ES', dial: '+34', flag: '🇪🇸' },
    { name: 'Afganistán', code: 'AF', dial: '+93', flag: '🇦🇫' },
    { name: 'Albania', code: 'AL', dial: '+355', flag: '🇦🇱' },
    { name: 'Alemania', code: 'DE', dial: '+49', flag: '🇩🇪' },
    { name: 'Andorra', code: 'AD', dial: '+376', flag: '🇦🇩' },
    { name: 'Angola', code: 'AO', dial: '+244', flag: '🇦🇴' },
    { name: 'Anguila', code: 'AI', dial: '+1 264', flag: '🇦🇮' },
    { name: 'Antigua y Barbuda', code: 'AG', dial: '+1 268', flag: '🇦🇬' },
    { name: 'Arabia Saudí', code: 'SA', dial: '+966', flag: '🇸🇦' },
    { name: 'Argelia', code: 'DZ', dial: '+213', flag: '🇩🇿' },
    { name: 'Argentina', code: 'AR', dial: '+54', flag: '🇦🇷' },
    { name: 'Armenia', code: 'AM', dial: '+374', flag: '🇦🇲' },
    { name: 'Aruba', code: 'AW', dial: '+297', flag: '🇦🇼' },
    { name: 'Australia', code: 'AU', dial: '+61', flag: '🇦🇺' },
    { name: 'Austria', code: 'AT', dial: '+43', flag: '🇦🇹' },
    { name: 'Azerbaiyán', code: 'AZ', dial: '+994', flag: '🇦🇿' },
    { name: 'Bahamas', code: 'BS', dial: '+1 242', flag: '🇧🇸' },
    { name: 'Baréin', code: 'BH', dial: '+973', flag: '🇧🇭' },
    { name: 'Bangladés', code: 'BD', dial: '+880', flag: '🇧🇩' },
    { name: 'Barbados', code: 'BB', dial: '+1 246', flag: '🇧🇧' },
    { name: 'Bélgica', code: 'BE', dial: '+32', flag: '🇧🇪' },
    { name: 'Belice', code: 'BZ', dial: '+501', flag: '🇧🇿' },
    { name: 'Benín', code: 'BJ', dial: '+229', flag: '🇧🇯' },
    { name: 'Bermudas', code: 'BM', dial: '+1 441', flag: '🇧🇲' },
    { name: 'Bután', code: 'BT', dial: '+975', flag: '🇧🇹' },
    { name: 'Bolivia', code: 'BO', dial: '+591', flag: '🇧🇴' },
    { name: 'Bosnia y Herzegovina', code: 'BA', dial: '+387', flag: '🇧🇦' },
    { name: 'Botsuana', code: 'BW', dial: '+267', flag: '🇧🇼' },
    { name: 'Brasil', code: 'BR', dial: '+55', flag: '🇧🇷' },
    { name: 'Brunéi', code: 'BN', dial: '+673', flag: '🇧🇳' },
    { name: 'Bulgaria', code: 'BG', dial: '+359', flag: '🇧🇬' },
    { name: 'Burkina Faso', code: 'BF', dial: '+226', flag: '🇧🇫' },
    { name: 'Burundi', code: 'BI', dial: '+257', flag: '🇧🇮' },
    { name: 'Cabo Verde', code: 'CV', dial: '+238', flag: '🇨🇻' },
    { name: 'Camboya', code: 'KH', dial: '+855', flag: '🇰🇭' },
    { name: 'Camerún', code: 'CM', dial: '+237', flag: '🇨🇲' },
    { name: 'Canadá', code: 'CA', dial: '+1', flag: '🇨🇦' },
    { name: 'Catar', code: 'QA', dial: '+974', flag: '🇶🇦' },
    { name: 'Chad', code: 'TD', dial: '+235', flag: '🇹🇩' },
    { name: 'Chile', code: 'CL', dial: '+56', flag: '🇨🇱' },
    { name: 'China', code: 'CN', dial: '+86', flag: '🇨🇳' },
    { name: 'Chipre', code: 'CY', dial: '+357', flag: '🇨🇾' },
    { name: 'Colombia', code: 'CO', dial: '+57', flag: '🇨🇴' },
    { name: 'Comoras', code: 'KM', dial: '+269', flag: '🇰🇲' },
    { name: 'Congo (Rep.)', code: 'CG', dial: '+242', flag: '🇨🇬' },
    { name: 'Congo (RDC)', code: 'CD', dial: '+243', flag: '🇨🇩' },
    { name: 'Corea del Norte', code: 'KP', dial: '+850', flag: '🇰🇵' },
    { name: 'Corea del Sur', code: 'KR', dial: '+82', flag: '🇰🇷' },
    { name: 'Costa de Marfil', code: 'CI', dial: '+225', flag: '🇨🇮' },
    { name: 'Costa Rica', code: 'CR', dial: '+506', flag: '🇨🇷' },
    { name: 'Croacia', code: 'HR', dial: '+385', flag: '🇭🇷' },
    { name: 'Cuba', code: 'CU', dial: '+53', flag: '🇨🇺' },
    { name: 'Curazao', code: 'CW', dial: '+599', flag: '🇨🇼' },
    { name: 'Dinamarca', code: 'DK', dial: '+45', flag: '🇩🇰' },
    { name: 'Dominica', code: 'DM', dial: '+1 767', flag: '🇩🇲' },
    { name: 'República Dominicana', code: 'DO', dial: '+1 809', flag: '🇩🇴' },
    { name: 'Ecuador', code: 'EC', dial: '+593', flag: '🇪🇨' },
    { name: 'Egipto', code: 'EG', dial: '+20', flag: '🇪🇬' },
    { name: 'El Salvador', code: 'SV', dial: '+503', flag: '🇸🇻' },
    { name: 'Emiratos Árabes Unidos', code: 'AE', dial: '+971', flag: '🇦🇪' },
    { name: 'Eritrea', code: 'ER', dial: '+291', flag: '🇪🇷' },
    { name: 'Eslovaquia', code: 'SK', dial: '+421', flag: '🇸🇰' },
    { name: 'Eslovenia', code: 'SI', dial: '+386', flag: '🇸🇮' },
    { name: 'Estados Unidos', code: 'US', dial: '+1', flag: '🇺🇸' },
    { name: 'Estonia', code: 'EE', dial: '+372', flag: '🇪🇪' },
    { name: 'Esuatini', code: 'SZ', dial: '+268', flag: '🇸🇿' },
    { name: 'Etiopía', code: 'ET', dial: '+251', flag: '🇪🇹' },
    { name: 'Filipinas', code: 'PH', dial: '+63', flag: '🇵🇭' },
    { name: 'Finlandia', code: 'FI', dial: '+358', flag: '🇫🇮' },
    { name: 'Francia', code: 'FR', dial: '+33', flag: '🇫🇷' },
    { name: 'Gabón', code: 'GA', dial: '+241', flag: '🇬🇦' },
    { name: 'Gambia', code: 'GM', dial: '+220', flag: '🇬🇲' },
    { name: 'Georgia', code: 'GE', dial: '+995', flag: '🇬🇪' },
    { name: 'Ghana', code: 'GH', dial: '+233', flag: '🇬🇭' },
    { name: 'Gibraltar', code: 'GI', dial: '+350', flag: '🇬🇮' },
    { name: 'Granada', code: 'GD', dial: '+1 473', flag: '🇬🇩' },
    { name: 'Grecia', code: 'GR', dial: '+30', flag: '🇬🇷' },
    { name: 'Groenlandia', code: 'GL', dial: '+299', flag: '🇬🇱' },
    { name: 'Guadalupe', code: 'GP', dial: '+590', flag: '🇬🇵' },
    { name: 'Guam', code: 'GU', dial: '+1 671', flag: '🇬🇺' },
    { name: 'Guatemala', code: 'GT', dial: '+502', flag: '🇬🇹' },
    { name: 'Guayana Francesa', code: 'GF', dial: '+594', flag: '🇬🇫' },
    { name: 'Guinea', code: 'GN', dial: '+224', flag: '🇬🇳' },
    { name: 'Guinea-Bisáu', code: 'GW', dial: '+245', flag: '🇬🇼' },
    { name: 'Guinea Ecuatorial', code: 'GQ', dial: '+240', flag: '🇬🇶' },
    { name: 'Guyana', code: 'GY', dial: '+592', flag: '🇬🇾' },
    { name: 'Haití', code: 'HT', dial: '+509', flag: '🇭🇹' },
    { name: 'Honduras', code: 'HN', dial: '+504', flag: '🇭🇳' },
    { name: 'Hong Kong', code: 'HK', dial: '+852', flag: '🇭🇰' },
    { name: 'Hungría', code: 'HU', dial: '+36', flag: '🇭🇺' },
    { name: 'India', code: 'IN', dial: '+91', flag: '🇮🇳' },
    { name: 'Indonesia', code: 'ID', dial: '+62', flag: '🇮🇩' },
    { name: 'Irak', code: 'IQ', dial: '+964', flag: '🇮🇶' },
    { name: 'Irán', code: 'IR', dial: '+98', flag: '🇮🇷' },
    { name: 'Irlanda', code: 'IE', dial: '+353', flag: '🇮🇪' },
    { name: 'Isla de Man', code: 'IM', dial: '+44', flag: '🇮🇲' },
    { name: 'Islandia', code: 'IS', dial: '+354', flag: '🇮🇸' },
    { name: 'Islas Caimán', code: 'KY', dial: '+1 345', flag: '🇰🇾' },
    { name: 'Islas Cook', code: 'CK', dial: '+682', flag: '🇨🇰' },
    { name: 'Islas Feroe', code: 'FO', dial: '+298', flag: '🇫🇴' },
    { name: 'Islas Malvinas', code: 'FK', dial: '+500', flag: '🇫🇰' },
    { name: 'Islas Marshall', code: 'MH', dial: '+692', flag: '🇲🇭' },
    { name: 'Islas Salomón', code: 'SB', dial: '+677', flag: '🇸🇧' },
    { name: 'Islas Turcas y Caicos', code: 'TC', dial: '+1 649', flag: '🇹🇨' },
    { name: 'Islas Vírgenes Británicas', code: 'VG', dial: '+1 284', flag: '🇻🇬' },
    { name: 'Islas Vírgenes EE. UU.', code: 'VI', dial: '+1 340', flag: '🇻🇮' },
    { name: 'Israel', code: 'IL', dial: '+972', flag: '🇮🇱' },
    { name: 'Italia', code: 'IT', dial: '+39', flag: '🇮🇹' },
    { name: 'Jamaica', code: 'JM', dial: '+1 876', flag: '🇯🇲' },
    { name: 'Japón', code: 'JP', dial: '+81', flag: '🇯🇵' },
    { name: 'Jordania', code: 'JO', dial: '+962', flag: '🇯🇴' },
    { name: 'Kazajistán', code: 'KZ', dial: '+7', flag: '🇰🇿' },
    { name: 'Kenia', code: 'KE', dial: '+254', flag: '🇰🇪' },
    { name: 'Kirguistán', code: 'KG', dial: '+996', flag: '🇰🇬' },
    { name: 'Kiribati', code: 'KI', dial: '+686', flag: '🇰🇮' },
    { name: 'Kosovo', code: 'XK', dial: '+383', flag: '🇽🇰' },
    { name: 'Kuwait', code: 'KW', dial: '+965', flag: '🇰🇼' },
    { name: 'Laos', code: 'LA', dial: '+856', flag: '🇱🇦' },
    { name: 'Lesoto', code: 'LS', dial: '+266', flag: '🇱🇸' },
    { name: 'Letonia', code: 'LV', dial: '+371', flag: '🇱🇻' },
    { name: 'Líbano', code: 'LB', dial: '+961', flag: '🇱🇧' },
    { name: 'Liberia', code: 'LR', dial: '+231', flag: '🇱🇷' },
    { name: 'Libia', code: 'LY', dial: '+218', flag: '🇱🇾' },
    { name: 'Liechtenstein', code: 'LI', dial: '+423', flag: '🇱🇮' },
    { name: 'Lituania', code: 'LT', dial: '+370', flag: '🇱🇹' },
    { name: 'Luxemburgo', code: 'LU', dial: '+352', flag: '🇱🇺' },
    { name: 'Macao', code: 'MO', dial: '+853', flag: '🇲🇴' },
    { name: 'Macedonia del Norte', code: 'MK', dial: '+389', flag: '🇲🇰' },
    { name: 'Madagascar', code: 'MG', dial: '+261', flag: '🇲🇬' },
    { name: 'Malasia', code: 'MY', dial: '+60', flag: '🇲🇾' },
    { name: 'Malaui', code: 'MW', dial: '+265', flag: '🇲🇼' },
    { name: 'Maldivas', code: 'MV', dial: '+960', flag: '🇲🇻' },
    { name: 'Malí', code: 'ML', dial: '+223', flag: '🇲🇱' },
    { name: 'Malta', code: 'MT', dial: '+356', flag: '🇲🇹' },
    { name: 'Marruecos', code: 'MA', dial: '+212', flag: '🇲🇦' },
    { name: 'Martinica', code: 'MQ', dial: '+596', flag: '🇲🇶' },
    { name: 'Mauricio', code: 'MU', dial: '+230', flag: '🇲🇺' },
    { name: 'Mauritania', code: 'MR', dial: '+222', flag: '🇲🇷' },
    { name: 'Mayotte', code: 'YT', dial: '+262', flag: '🇾🇹' },
    { name: 'México', code: 'MX', dial: '+52', flag: '🇲🇽' },
    { name: 'Micronesia', code: 'FM', dial: '+691', flag: '🇫🇲' },
    { name: 'Moldavia', code: 'MD', dial: '+373', flag: '🇲🇩' },
    { name: 'Mónaco', code: 'MC', dial: '+377', flag: '🇲🇨' },
    { name: 'Mongolia', code: 'MN', dial: '+976', flag: '🇲🇳' },
    { name: 'Montenegro', code: 'ME', dial: '+382', flag: '🇲🇪' },
    { name: 'Montserrat', code: 'MS', dial: '+1 664', flag: '🇲🇸' },
    { name: 'Mozambique', code: 'MZ', dial: '+258', flag: '🇲🇿' },
    { name: 'Myanmar', code: 'MM', dial: '+95', flag: '🇲🇲' },
    { name: 'Namibia', code: 'NA', dial: '+264', flag: '🇳🇦' },
    { name: 'Nauru', code: 'NR', dial: '+674', flag: '🇳🇷' },
    { name: 'Nepal', code: 'NP', dial: '+977', flag: '🇳🇵' },
    { name: 'Nicaragua', code: 'NI', dial: '+505', flag: '🇳🇮' },
    { name: 'Níger', code: 'NE', dial: '+227', flag: '🇳🇪' },
    { name: 'Nigeria', code: 'NG', dial: '+234', flag: '🇳🇬' },
    { name: 'Niue', code: 'NU', dial: '+683', flag: '🇳🇺' },
    { name: 'Noruega', code: 'NO', dial: '+47', flag: '🇳🇴' },
    { name: 'Nueva Caledonia', code: 'NC', dial: '+687', flag: '🇳🇨' },
    { name: 'Nueva Zelanda', code: 'NZ', dial: '+64', flag: '🇳🇿' },
    { name: 'Omán', code: 'OM', dial: '+968', flag: '🇴🇲' },
    { name: 'Países Bajos', code: 'NL', dial: '+31', flag: '🇳🇱' },
    { name: 'Pakistán', code: 'PK', dial: '+92', flag: '🇵🇰' },
    { name: 'Palaos', code: 'PW', dial: '+680', flag: '🇵🇼' },
    { name: 'Palestina', code: 'PS', dial: '+970', flag: '🇵🇸' },
    { name: 'Panamá', code: 'PA', dial: '+507', flag: '🇵🇦' },
    { name: 'Papúa Nueva Guinea', code: 'PG', dial: '+675', flag: '🇵🇬' },
    { name: 'Paraguay', code: 'PY', dial: '+595', flag: '🇵🇾' },
    { name: 'Perú', code: 'PE', dial: '+51', flag: '🇵🇪' },
    { name: 'Polonia', code: 'PL', dial: '+48', flag: '🇵🇱' },
    { name: 'Portugal', code: 'PT', dial: '+351', flag: '🇵🇹' },
    { name: 'Puerto Rico', code: 'PR', dial: '+1 787', flag: '🇵🇷' },
    { name: 'Reino Unido', code: 'GB', dial: '+44', flag: '🇬🇧' },
    { name: 'República Centroafricana', code: 'CF', dial: '+236', flag: '🇨🇫' },
    { name: 'República Checa', code: 'CZ', dial: '+420', flag: '🇨🇿' },
    { name: 'Reunión', code: 'RE', dial: '+262', flag: '🇷🇪' },
    { name: 'Rumanía', code: 'RO', dial: '+40', flag: '🇷🇴' },
    { name: 'Rusia', code: 'RU', dial: '+7', flag: '🇷🇺' },
    { name: 'Ruanda', code: 'RW', dial: '+250', flag: '🇷🇼' },
    { name: 'Samoa', code: 'WS', dial: '+685', flag: '🇼🇸' },
    { name: 'Samoa Americana', code: 'AS', dial: '+1 684', flag: '🇦🇸' },
    { name: 'San Bartolomé', code: 'BL', dial: '+590', flag: '🇧🇱' },
    { name: 'San Cristóbal y Nieves', code: 'KN', dial: '+1 869', flag: '🇰🇳' },
    { name: 'San Marino', code: 'SM', dial: '+378', flag: '🇸🇲' },
    { name: 'San Martín', code: 'MF', dial: '+590', flag: '🇲🇫' },
    { name: 'San Pedro y Miquelón', code: 'PM', dial: '+508', flag: '🇵🇲' },
    { name: 'San Vicente y las Granadinas', code: 'VC', dial: '+1 784', flag: '🇻🇨' },
    { name: 'Santa Elena', code: 'SH', dial: '+290', flag: '🇸🇭' },
    { name: 'Santa Lucía', code: 'LC', dial: '+1 758', flag: '🇱🇨' },
    { name: 'Santo Tomé y Príncipe', code: 'ST', dial: '+239', flag: '🇸🇹' },
    { name: 'Senegal', code: 'SN', dial: '+221', flag: '🇸🇳' },
    { name: 'Serbia', code: 'RS', dial: '+381', flag: '🇷🇸' },
    { name: 'Seychelles', code: 'SC', dial: '+248', flag: '🇸🇨' },
    { name: 'Sierra Leona', code: 'SL', dial: '+232', flag: '🇸🇱' },
    { name: 'Singapur', code: 'SG', dial: '+65', flag: '🇸🇬' },
    { name: 'Sint Maarten', code: 'SX', dial: '+1 721', flag: '🇸🇽' },
    { name: 'Siria', code: 'SY', dial: '+963', flag: '🇸🇾' },
    { name: 'Somalia', code: 'SO', dial: '+252', flag: '🇸🇴' },
    { name: 'Sri Lanka', code: 'LK', dial: '+94', flag: '🇱🇰' },
    { name: 'Sudáfrica', code: 'ZA', dial: '+27', flag: '🇿🇦' },
    { name: 'Sudán', code: 'SD', dial: '+249', flag: '🇸🇩' },
    { name: 'Sudán del Sur', code: 'SS', dial: '+211', flag: '🇸🇸' },
    { name: 'Suecia', code: 'SE', dial: '+46', flag: '🇸🇪' },
    { name: 'Suiza', code: 'CH', dial: '+41', flag: '🇨🇭' },
    { name: 'Surinam', code: 'SR', dial: '+597', flag: '🇸🇷' },
    { name: 'Tailandia', code: 'TH', dial: '+66', flag: '🇹🇭' },
    { name: 'Taiwán', code: 'TW', dial: '+886', flag: '🇹🇼' },
    { name: 'Tanzania', code: 'TZ', dial: '+255', flag: '🇹🇿' },
    { name: 'Tayikistán', code: 'TJ', dial: '+992', flag: '🇹🇯' },
    { name: 'Territorio del Sahara Occidental', code: 'EH', dial: '+212', flag: '🇪🇭' },
    { name: 'Timor Oriental', code: 'TL', dial: '+670', flag: '🇹🇱' },
    { name: 'Togo', code: 'TG', dial: '+228', flag: '🇹🇬' },
    { name: 'Tokelau', code: 'TK', dial: '+690', flag: '🇹🇰' },
    { name: 'Tonga', code: 'TO', dial: '+676', flag: '🇹🇴' },
    { name: 'Trinidad y Tobago', code: 'TT', dial: '+1 868', flag: '🇹🇹' },
    { name: 'Túnez', code: 'TN', dial: '+216', flag: '🇹🇳' },
    { name: 'Turquía', code: 'TR', dial: '+90', flag: '🇹🇷' },
    { name: 'Turkmenistán', code: 'TM', dial: '+993', flag: '🇹🇲' },
    { name: 'Tuvalu', code: 'TV', dial: '+688', flag: '🇹🇻' },
    { name: 'Ucrania', code: 'UA', dial: '+380', flag: '🇺🇦' },
    { name: 'Uganda', code: 'UG', dial: '+256', flag: '🇺🇬' },
    { name: 'Uruguay', code: 'UY', dial: '+598', flag: '🇺🇾' },
    { name: 'Uzbekistán', code: 'UZ', dial: '+998', flag: '🇺🇿' },
    { name: 'Vanuatu', code: 'VU', dial: '+678', flag: '🇻🇺' },
    { name: 'Venezuela', code: 'VE', dial: '+58', flag: '🇻🇪' },
    { name: 'Vietnam', code: 'VN', dial: '+84', flag: '🇻🇳' },
    { name: 'Wallis y Futuna', code: 'WF', dial: '+681', flag: '🇼🇫' },
    { name: 'Yemen', code: 'YE', dial: '+967', flag: '🇾🇪' },
    { name: 'Zambia', code: 'ZM', dial: '+260', flag: '🇿🇲' },
    { name: 'Zimbabue', code: 'ZW', dial: '+263', flag: '🇿🇼' }
  ];

  function renderPrefixButton(dial, flag) {
    if (!prefixBtn) return;
    prefixBtn.innerHTML = `<span class="flag">${flag}</span> <span class=\"dial\"><strong>${dial}</strong></span>`;
  }

  function closePrefixList() {
    if (!prefixList || !prefixBtn) return;
    prefixList.hidden = true;
    prefixBtn.setAttribute('aria-expanded', 'false');
  }

  function togglePrefixList() {
    if (!prefixList || !prefixBtn) return;
    const expanded = prefixBtn.getAttribute('aria-expanded') === 'true';
    if (expanded) {
      closePrefixList();
    } else {
      prefixList.hidden = false;
      prefixBtn.setAttribute('aria-expanded', 'true');
    }
  }

  function populateDialCodes() {
    if (!prefixList || !prefijoHidden) return;
    // Ordenar por nombre, dejando España arriba
    const sorted = DIAL_CODES.slice().sort((a, b) => {
      if (a.code === 'ES') return -1;
      if (b.code === 'ES') return 1;
      return a.name.localeCompare(b.name, 'es');
    });

    // Encabezado con buscador
    prefixList.innerHTML = '';
    const searchWrap = document.createElement('div');
    searchWrap.className = 'prefix-search';
    prefixSearchInput = document.createElement('input');
    prefixSearchInput.type = 'text';
    prefixSearchInput.placeholder = 'Buscar país o código (+34, espa…)';
    searchWrap.appendChild(prefixSearchInput);
    prefixList.appendChild(searchWrap);

    // Contenedor de opciones
    const optionsWrap = document.createElement('div');
    prefixList.appendChild(optionsWrap);

    function normalizeDial(v) {
      return (v || '').toString().replace(/\s+/g, '');
    }

    function renderOptions(filter = '') {
      const q = (filter || '').toString().trim().toLowerCase();
      const qDigits = q.replace(/[^\d+]/g, '');
      optionsWrap.innerHTML = '';

      const matches = sorted.filter((c) => {
        const dial = normalizeDial(c.dial).toLowerCase();
        const name = (c.name || '').toLowerCase();
        // Coincide por nombre o por código
        const byName = q.length > 0 && name.includes(q);
        const byDial = qDigits.length > 0 && dial.includes(qDigits.startsWith('+') ? qDigits : (qDigits.startsWith('00') ? '+' + qDigits.slice(2) : qDigits));
        return q ? (byName || byDial) : true;
      });

      for (const c of matches) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'prefix-option';
        btn.setAttribute('role', 'option');
        btn.dataset.dial = normalizeDial(c.dial);
        btn.dataset.code = c.code;
        btn.innerHTML = `<span class=\"flag\">${c.flag}</span> <span class=\"dial\">${c.dial}</span> <span class=\"name\">${c.name}</span>`;
        btn.addEventListener('click', () => {
          prefijoHidden.value = btn.dataset.dial;
          renderPrefixButton(btn.dataset.dial, c.flag);
          closePrefixList();
          phoneInput && phoneInput.focus();
        });
        optionsWrap.appendChild(btn);
      }

      // Autoselección si coincide exactamente un código
      if (qDigits) {
        const normalizedInput = qDigits.startsWith('+') ? qDigits : ('+' + qDigits.replace(/^0+/, ''));
        const exact = sorted.find(c => normalizeDial(c.dial) === normalizedInput);
        if (exact) {
          prefijoHidden.value = normalizeDial(exact.dial);
          renderPrefixButton(prefijoHidden.value, exact.flag);
        }
      }

      return matches;
    }

    // Eventos buscador
    prefixSearchInput.addEventListener('input', () => {
      renderOptions(prefixSearchInput.value);
    });
    prefixSearchInput.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') {
        const matches = renderOptions(prefixSearchInput.value);
        const first = optionsWrap.querySelector('.prefix-option');
        if (first) first.click();
      }
    });

    // Pintar opciones iniciales y set por defecto España
    renderOptions('');
    const es = sorted.find(c => c.code === 'ES');
    if (es) {
      prefijoHidden.value = normalizeDial(es.dial);
      renderPrefixButton(prefijoHidden.value, es.flag);
    }
  }
  populateDialCodes();
  // (sin padding dinámico; usamos layout flex)

  // Abrir/cerrar lista
  if (prefixBtn) {
    prefixBtn.addEventListener('click', () => {
      togglePrefixList();
      // Enfocar buscador al abrir
      if (prefixBtn.getAttribute('aria-expanded') === 'true' && prefixSearchInput) {
        prefixSearchInput.value = '';
        prefixSearchInput.focus();
      }
    });
    // Escribir para buscar directamente
    prefixBtn.addEventListener('keydown', (ev) => {
      const isDigit = /[0-9]/.test(ev.key);
      const isPlus = ev.key === '+';
      const isBack = ev.key === 'Backspace';
      const isEnter = ev.key === 'Enter';
      if (!(isDigit || isPlus || isBack || isEnter)) return;
      if (prefixBtn.getAttribute('aria-expanded') !== 'true') {
        togglePrefixList();
      }
      if (prefixSearchInput) {
        if (isEnter) {
          const first = document.querySelector('#prefixList .prefix-option');
          if (first) first.click();
        } else {
          ev.preventDefault();
          if (isBack) {
            prefixSearchInput.value = prefixSearchInput.value.slice(0, -1);
          } else {
            prefixSearchInput.value += ev.key;
          }
          const inputEvent = new Event('input', { bubbles: true });
          prefixSearchInput.dispatchEvent(inputEvent);
          prefixSearchInput.focus();
        }
      }
    });
  }
  // Cerrar al hacer clic fuera
  document.addEventListener('click', (ev) => {
    if (!prefixList || prefixList.hidden) return;
    const target = ev.target;
    if (!prefixList.contains(target) && !(prefixBtn && prefixBtn.contains(target))) {
      closePrefixList();
    }
  });
  // Cerrar con Escape
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') closePrefixList();
  });

  // Restringir campo teléfono: solo dígitos y espacios
  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      const cleaned = phoneInput.value.replace(/[^\d\s]/g, '');
      // colapsar espacios múltiples
      phoneInput.value = cleaned.replace(/\s{2,}/g, ' ').trimStart();
    });
  }

  // Textarea de comentarios: auto-ajustar alto según contenido
  if (commentsInput) {
    const autoResize = () => {
      commentsInput.style.height = 'auto';
      commentsInput.style.height = commentsInput.scrollHeight + 'px';
    };
    commentsInput.addEventListener('input', autoResize);
    window.addEventListener('load', autoResize);
  }

  // Sin validación de imágenes (campo eliminado)

  // Autocompletado básico para Municipio/Zona desde JSON local
  // (sin autocompletado de ubicación)

  function btnState(state) {
    if (!submitBtn) return;
    if (state === "sending") {
      submitBtn.disabled = true;
      submitBtn.classList.add("is-loading");
      submitBtn.textContent = "Enviando…";
    } else if (state === "success") {
      submitBtn.classList.remove("is-loading");
      submitBtn.disabled = true;
      submitBtn.textContent = "Enviado ✓";
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }, 1600);
    } else if (state === "error") {
      submitBtn.classList.remove("is-loading");
      submitBtn.disabled = false;
      submitBtn.textContent = "Error. Inténtalo de nuevo";
      setTimeout(() => {
        submitBtn.textContent = originalBtnText;
      }, 2200);
    } else {
      submitBtn.classList.remove("is-loading");
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }
  }

  function setStatusMessage(message, kind = "error") {
    if (!statusEl) return;
    statusEl.textContent = message || "";
    statusEl.style.color = kind === "error" ? "#b3261e" : "#19191A";
  }

  function clearCustomValidation() {
    [nameInput, emailInput, phoneInput, locationInput].forEach((el) => {
      if (el) el.setCustomValidity("");
    });
  }

  function validateBeforeSubmit() {
    clearCustomValidation();
    setStatusMessage("");

    if (nameInput) {
      const normalizedName = (nameInput.value || "").replace(/\s+/g, " ").trim();
      nameInput.value = normalizedName;
    }

    if (emailInput) {
      const normalizedEmail = (emailInput.value || "").trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

      emailInput.value = normalizedEmail;

      if (!emailPattern.test(normalizedEmail)) {
        emailInput.setCustomValidity("Introduce un correo electrónico válido.");
      }
    }

    if (phoneInput) {
      const digitsOnly = (phoneInput.value || "").replace(/\D+/g, "");
      if (digitsOnly.length < 7 || digitsOnly.length > 15) {
        phoneInput.setCustomValidity("El teléfono debe tener entre 7 y 15 dígitos.");
      }
    }

    if (locationInput) {
      const normalizedLocation = (locationInput.value || "").replace(/\s+/g, " ").trim();
      locationInput.value = normalizedLocation;

      if (normalizedLocation.length < 3) {
        locationInput.setCustomValidity("La ubicación debe tener al menos 3 caracteres.");
      } else if (!/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(normalizedLocation)) {
        locationInput.setCustomValidity("Introduce una ubicación válida (municipio o zona).");
      }
    }

    const tipoChecked = form.querySelector('input[name="tipo"]:checked');
    const plazoChecked = form.querySelector('input[name="plazo"]:checked');

    if (!tipoChecked || !plazoChecked) {
      setStatusMessage("Completa las preguntas obligatorias antes de enviar.");
      return false;
    }

    if (!form.checkValidity()) {
      setStatusMessage("Revisa los campos marcados e inténtalo de nuevo.");
      form.reportValidity();
      return false;
    }

    return true;
  }

  function renderConfirmation() {
    const wrap = document.querySelector('.wrap');
    if (!wrap) return;
    wrap.innerHTML = `
      <div class="confirmation">
        <h1 class="confirmationTitle">¡ESTAMOS LISTOS PARA EMPEZAR!</h1>
        <p>Ya está un paso más cerca de vender su propiedad. Hemos recibido su información y nos pondremos en contacto a la mayor brevedad.</p>
        <div class="socialLinks">
          <a class="socialIcon whatsapp" href="https://wa.me/message/EKVF2U6R7O2AH1" target="_blank" rel="noopener" aria-label="WhatsApp"><img class="fallbackSvg" src="./assets/whatsapp.svg" alt="WhatsApp"></a>
          <a class="socialIcon instagram" href="https://www.instagram.com/maxsoriano.realestate/" target="_blank" rel="noopener" aria-label="Instagram"><img class="fallbackSvg" src="./assets/instagram.svg" alt="Instagram"></a>
          <a class="socialIcon tiktok" href="https://www.tiktok.com/@maxsoriano.realestate" target="_blank" rel="noopener" aria-label="TikTok"><img class="fallbackSvg" src="./assets/tiktok.svg" alt="TikTok"></a>
        </div>
      </div>
    `;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateBeforeSubmit()) {
      return;
    }

    if (!ENDPOINT_URL || ENDPOINT_URL.includes("REEMPLAZA")) {
      btnState("error");
      return;
    }

    btnState("sending");

    try {
      const fd = new FormData(form);
      const checked = (name) => form.querySelector(`input[name="${name}"]:checked`);
      ["tipo", "precio", "plazo"].forEach((name) => {
        const el = checked(name);
        if (el) fd.set(name, el.value);
  });

  // (botón de test eliminado)
      // Unificar teléfono: prefijo + número (solo dígitos)
      if (prefijoHidden && phoneInput) {
        const dial = (prefijoHidden.value || '').trim();
        const raw = (phoneInput.value || '').trim();
        if (dial && raw) {
          const digitsOnly = raw.replace(/\D+/g, '');
          fd.set('telefono', `${dial} ${digitsOnly}`.trim());
          fd.set('prefijo', dial);
        }
      }

      // Sin adjuntar imágenes (campo eliminado)

      const params = new URLSearchParams();
      for (const [key, value] of fd.entries()) {
        params.append(key, value);
      }

      await fetch(ENDPOINT_URL, {
        method: "POST",
        body: params,
        mode: "no-cors",
      });

      setStatusMessage("");
      btnState("success");
      form.reset();
      renderConfirmation();
    } catch (err) {
      console.error(err);
      btnState("error");
    }
  });
})();
