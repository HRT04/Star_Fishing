# cd ../webxr_test
# cp -r ../test/dist/* .
# git add --all
# git commit -a -m "deploy"
# git push origin main
# scp -r dist/* dnchu@www2217.sakura.ne.jp:www/webxr/


# scp -P 1322 -r /Users/sakiyamatokio/starry/Star_Fishing/dist/* e215711@shell.ie.u-ryukyu.ac.jp:~/public_html/webxr
rsync -av -e 'ssh -p 1322' /Users/sakiyamatokio/starry/Star_Fishing/dist/* e215711@shell.ie.u-ryukyu.ac.jp:~/public_html/webxr

# scp -P 1322 -r /Users/a/AR/star_fishing/dist/* e215711@shell.ie.u-ryukyu.ac.jp:~/public_html/webxr
# https://ie.u-ryukyu.ac.jp/~e215707/webxr/