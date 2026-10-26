# Falla Conmigo

[Seguir mi progreso en aprender espanol, c, emacs y javascript](https://dericbytes.github.io/falla-conmigo/index.html)




# react-native-con-meli


source org files
"~/wd/falla-conmigo/docs/org/react-native-con-meli/"
html generate files
"~/wd/falla-conmigo/docs/pages/react-native-con-meli"

see variable  `org-publish-project-alist' in file ~/emacs-config/dem/setup-dem/org/init-org-publish.el
project "react-native-con-meli". not uses html-preamble & post-preamble used

	M-x publish-project react-native-con-meli
	cd ~/wd/falla-conmigo/docs/pages/react-native-con-meli
	git add .
	git commit -m "react-native-con-meli first page"
    git push
	// wait few minutes
	chrome https://dericbytes.github.io/falla-conmigo/pages/react-native-con-meli/blog.html


# run folder as web server -

~/pnotes/emacs/simple-httpd/using-simple-httpd.org

[[id:ece0d75c-9a52-4ea9-ad4b-f94630293f1c][run folder as web site]]




(require 'simple-httpd)
(setq httpd-root "~/wd/falla-conmigo/")
(setq httpd-port 8080)
(httpd-start)






firefox http://localhost:8080

open file 'pages/react-native-con-meli/blog.html' in web root ~/wd/falla-conmigo/docs/

firefox http://localhost:8080/docs/pages/react-native-con-meli/blog.html




    firefox http://localhost:8080/docs/pages/react-native-con-meli/blog.html
