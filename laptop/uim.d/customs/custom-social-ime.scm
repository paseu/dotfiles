(define social-ime-show-segment-separator? #f)
(define social-ime-segment-separator "|")
(define social-ime-use-candidate-window? #t)
(define social-ime-candidate-op-count 1)
(define social-ime-nr-candidate-max 10)
(define social-ime-select-candidate-by-numeral-key? #f)
(define social-ime-widgets '(widget_social-ime_input_mode widget_social-ime_kana_input_method))
(define default-widget_social-ime_input_mode 'action_social-ime_direct)
(define social-ime-input-mode-actions '(action_social-ime_direct action_social-ime_hiragana action_social-ime_katakana action_social-ime_halfkana action_social-ime_halfwidth_alnum action_social-ime_fullwidth_alnum))
(define default-widget_social-ime_kana_input_method 'action_social-ime_roma)
(define social-ime-kana-input-method-actions '(action_social-ime_roma action_social-ime_kana action_social-ime_azik action_social-ime_act action_social-ime_kzik))