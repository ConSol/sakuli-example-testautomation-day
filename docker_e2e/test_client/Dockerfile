# This Dockerfile is used to build an sakuli image based on Centos

FROM consol/sakuli-centos-xfce
MAINTAINER Tobias Schneck "tobias.schneck@consol.de"
ENV REFRESHED_AT 2015-09-22

### config `DE` Firefox default langaue
RUN echo 'user_pref("intl.accept_languages", "de, en-US, en");' >> /root/sakuli/sahi/config/ff_profile_template/prefs.js

### Install and config Master PDF
RUN yum install -y ftp://ftp.pbone.net/mirror/ftp5.gwdg.de/pub/opensuse/repositories/home:/Kenzy:/packages/Fedora_19/x86_64/pdfeditor-1.8.70-2.1.x86_64.rpm
RUN mkdir -p '/root/.config/Code Industry' \
   && echo -e 'check_updates=0' > '/root/.config/Code Industry/Master PDF Editor.conf'

