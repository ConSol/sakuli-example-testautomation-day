# This Dockerfile is used to build an sakuli image based on Centos

FROM consol/sakuli-centos-xfce:v0.9.1
MAINTAINER Tobias Schneck "tobias.schneck@consol.de"
ENV REFRESHED_AT 2015-09-22

### config `DE` Firefox default langaue
RUN echo 'user_pref("intl.accept_languages", "de, en-US, en");' >> /root/sakuli/sahi/config/ff_profile_template/prefs.js

### Install and config Master PDF
RUN yum install -y http://get.code-industry.net/public/master-pdf-editor3-3.4.03-1.x86_64.rpm
RUN mkdir -p '/root/.config/Code Industry' \
   && echo -e 'check_updates=0\nshow%20ObjectInspector=false' > '/root/.config/Code Industry/Master PDF Editor.conf'