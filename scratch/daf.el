; Daf Yomi interface to emacs calendar.  You can put something like this
; in your startup (.emacs) file:
;      (calendar)
;      (load-library "/your-elisp-path/daf.elc")
;      (define-key calendar-mode-map "y" `calendar-dafyomi)
; assuming you`ve byte-compiled this file, and changing your-elisp-path
; as required.  There are many other ways to do it, of course.  This will
; tie the `y` key in the calendar window to the Daf Yomi calculation.
; Position the cursor on the date you want, press `y` and you`ll see the 
; Daf Yomi for that day.  The program gives correct answers for all past,
; present, and future Daf Yomi cycles (as far as I have been able to test).
;
; Improvements, bug reports, comments, to:  
; bobnewell@bobnewell.net
;
; This program is hereby released into the public domain.
; Bob Newell

; First written: Bismarck, North Dakota, April 24, 1998
; Revision log: Santa Fe, New Mexico, November 14, 2007
;                 Was not touched for some while.
;               Honolulu, Hawai`i, December 14, 2012.
;                 First revision in over 5 years.
;                 The code is over 14 years old.

; If you don`t know about Daf Yomi then you probably don`t need this program!

(defun calendar-dafyomi () 
  "Get Daf Yomi for calendar date"  (interactive)
  (princ (getdaf (calendar-cursor-to-date t)))
)

(defun todays-daf ()
  "Get today's daf and say it"
  (interactive)
  (defvar daf-temp)
  (setq daf-temp (decode-time (current-time)))
  (setq daf-temp (getdaf (list (nth 4 daf-temp)
                (nth 3 daf-temp)
                (nth 5 daf-temp))))
  (message daf-temp)
)
  
(defun insert-todays-daf ()
 "Insert today's daf into current buffer"
;; No newline and no cycle number
 (interactive)  
   (defvar daf-temp)
   (setq daf-temp (decode-time (current-time)))
   (getdaf (list (nth 4 daf-temp)
                (nth 3 daf-temp)
                (nth 5 daf-temp)))
   (insert daf-blatt)
)

(defun getdaf (date) 

;; 'date' is a list (month day yyyy)
 
  (defvar daf-mnames ["Berachos"  "Shabbat"  "Eruvin"  "Pesachim"  "Shekalim"
       "Yoma"  "Sukkah"  "Beitzah" "Rosh Hashana"  "Taanit"
       "Megillah"  "Moed Katan"  "Chagigah"  "Yevamot"  "Ketubot"
       "Nedarim"  "Nazir"  "Sotah"  "Gitin"  "Kiddushin"
       "Baba Kamma"  "Baba Metzia"  "Baba Basra"  "Sanhedrin"
       "Makkos"  "Shevuos"  "Avodah Zarah"  "Horayot"  "Zevachim"
       "Menachos"  "Chullin"  "Bechoros"  "Arachin"  "Temurah"
       "Keritot"  "Meilah"  "Kinnim"  "Tamid"  "Midos"  "Niddah"]) 
 
(defvar daf-mblatt [64  157  105  121  22  88  56  40 35  31  32  29  27       
      122  112  91  66  49  90  82  119  119  176  113  24 
      49  76  14  120  110  142  61  34 34  28  22  4  10  4  73]) 
 
(defvar daf-cno)(defvar daf-dno)(defvar dafcnt)(defvar daf-osday)(defvar daf-nsday) 
(defvar daf-month)(defvar daf-day)(defvar daf-year)(defvar daf-total)(defvar daf-count) 
(defvar daf-j)(defvar daf-cday)(defvar daf-t-blatt)(defvar daf-answer)(defvar daf-blatt)
 
(setq dafcnt 40)
 
(setq daf-month (car date))
(setq daf-day (car (cdr date)))
(setq daf-year (car (cdr (cdr date))))
 
(setq daf-osday (calendar-absolute-from-gregorian (list 9 11 1923))) 
(setq daf-nsday (calendar-absolute-from-gregorian (list 6 24 1975))) 
(setq  daf-cday (calendar-absolute-from-gregorian (list daf-month daf-day daf-year))) 
 
; No cycle, new cycle, old cycle
(cond
    ( (< daf-cday daf-osday) 
    (error "The date given is prior to organized Daf Yomi cycles"))
     ( (>= daf-cday daf-nsday)
      (progn
(setq daf-cno (+ 8 (/ (- daf-cday daf-nsday) 2711)))
(setq daf-dno (% (- daf-cday daf-nsday) 2711))
      ))
    (t 
    (progn
(setq daf-cno (+ 1 (/ (- daf-cday daf-osday) 2702)))
(setq daf-dno (% (- daf-cday daf-osday) 2702))
    ))
)
 
; Find the daf taking note that the cycle changed 
; slightly after cycle 7. 
 
(setq daf-total 0)
(setq daf-count (- 1))
(setq daf-t-blatt 0)
 
; Fix Shekalim for old cycles
(aset daf-mblatt 4 22)
(if (<= daf-cno  7) 
    (aset daf-mblatt 4 13))
 
; Find the daf
(setq daf-j 0)
(while (< daf-j dafcnt)
    (setq daf-count (1+ daf-count))
    (setq daf-total (- (+ daf-total (aref daf-mblatt daf-j)) 1 ) )
    (if  (< daf-dno  daf-total)
        (progn  
    (setq daf-t-blatt (- (1+ (aref daf-mblatt daf-j)) (- daf-total daf-dno)))
; Fiddle with the weird ones near the end
    (cond  
    ((eq daf-count 36)
      (setq daf-t-blatt (+ daf-t-blatt 21)))
    ((eq daf-count 37)
      (setq daf-t-blatt (+ daf-t-blatt 24)))
    ((eq daf-count 38)
      (setq daf-t-blatt (+ daf-t-blatt 33)))
    )
; Bailout
    (setq daf-j (1+ dafcnt))
    )
      )
    (setq daf-j (1+ daf-j))
)
 
(setq daf-blatt (concat (aref daf-mnames daf-count) " " (int-to-string daf-t-blatt)))

;; This must be last for the correct function rturn.
(setq daf-answer-with-cycle
      (concat "The Daf is on cycle " (int-to-string daf-cno) " "
              (aref daf-mnames daf-count) " "  (int-to-string daf-t-blatt))) 
 
)
 
