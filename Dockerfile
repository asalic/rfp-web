FROM ubuntu:16.04

MAINTAINER Andy S Alic (asalic@upv.es) Universitat Politecnica de Valencia

RUN apt-get update && apt-get -y install npm less curl maven openjdk-8-jdk openjdk-8-jre python-requests 
RUN npm install fs-extra path yargs jsrender request cheerio html-validator node-minify babel-core html-minifier babel-preset-es2015
RUN ln -s /usr/bin/nodejs /usr/bin/node
#  Open http(s) ports for the tomcat server
EXPOSE 8443
EXPOSE 8080

ARG tomcat_group=tomcat
ARG tomcat_user=tomcat
ARG tomcat_root=/opt/tomcat
ARG tomcat_minor_version=0.47
ARG app_base_path=/eubrabigsea
ARG app_path=${app_base_path}/rfp-web

# root variables
#ENV TOMCAT_USER ${tomcat_user}
#ENV TOMCAT_USER_PASSW default
ENV TOMCAT_ADMIN admin
ENV TOMCAT_ADMIN_PASSW password

# Create user and adjust permissions for tomcat
RUN echo ${tomcat_root}
RUN mkdir ${tomcat_root}
RUN groupadd ${tomcat_group}
RUN useradd -s /bin/false -g ${tomcat_group} -d ${tomcat_root} ${tomcat_user}
RUN chown -R ${tomcat_user}:${tomcat_group} ${tomcat_root}
#RUN echo ${TOMCAT_USER_PASSW} | passwd ${TOMCAT_USER} --stdin

# Install custom version of Tomcat (the one from the repo has bugs)
RUN curl -o /tmp/apache-tomcat-8.tar.gz http://apache.uvigo.es/tomcat/tomcat-8/v8.${tomcat_minor_version}/bin/apache-tomcat-8.${tomcat_minor_version}.tar.gz
RUN tar xzvf /tmp/apache-tomcat-8.tar.gz -C ${tomcat_root} --strip-components=1
#COPY ./tomcat-users_template.xml ${tomcat_root}/conf/tomcat-users.xml

RUN chmod -R g+r ${tomcat_root}/conf
RUN chmod -R +x ${tomcat_root}/bin/
RUN chmod g+x ${tomcat_root}/conf
RUN chown -R ${tomcat_user} ${tomcat_root}/conf/ ${tomcat_root}/webapps/ ${tomcat_root}/work/ ${tomcat_root}/temp/ ${tomcat_root}/logs/

# Create the app folder and giver full permission to the tomcat user
RUN mkdir -p ${app_path}
#COPY ./mesos-dns-discover.py ${app_base_path}
#RUN chmod +x ${app_base_path}/mesos-dns-discover.py
ADD ./ ${app_path}/
#COPY ./regions.json ${app_base_path}
RUN chown -R ${tomcat_user} ${app_base_path}

# Once we have everything set, time to switch to a restricted user
USER ${tomcat_user}

#  Different environment variables used to control the environment
ENV USER ${tomcat_user}
ENV APP_BASE_PATH ${app_base_path}
ENV APP_PATH ${app_path}
ENV TOMCAT_ROOT ${tomcat_root}
ENV PFX default
ENV PSQL_USER default
ENV PSQL_PASSW default
#ENV PSQL_PORT 0
#ENV PSQL_HOST localhost
ENV MESOS_DNS_IP_PORT http://127.0.0.1:8123
ENV MESOS_DNS_RFP_DB_ID _rfp-db-lb-rfp._tcp.marathon.mesos
ENV MESOS_DNS_LB_INTERNAL_ID _rfp-lb-internal-rfp._tcp.marathon.mesos
ENV LB_RFP_DB_PORT 0
ENV LB_RFP_DB_HOST server
ENV MESOS_DNS_AUTH_SERVICE_ID _auth._tcp.marathon.mesos
#ENV REGIONS_PATH ${app_base_path}/regions.json
ENV CMD_KEEP_ALIVE tail -f /dev/null
ENV REGIONS_URL ftp://ftpgrycap.i3m.upv.es/public/eubrabigsea/data/regions.json
ENV CONTACT_MAIL_ADDR default@mail.com

# Prepare and deploy app 
RUN rm -rf ${TOMCAT_ROOT}/webapps/ROOT.war ${TOMCAT_ROOT}/webapps/ROOT || true
#RUN cat ${APP_PATH}/pom.xml | sed "s|<tomcatUser>[^ ]*</tomcatUser>|<tomcatUser>${TOMCAT_USER}</tomcatUser>|" > ${APP_PATH}/pom.xml.tmp
#RUN cat ${APP_PATH}/pom.xml.tmp | sed "s|<tomcatUserPassw>[^ ]*</tomcatUserPassw>|<tomcatUserPassw>${TOMCAT_USER_PASSW}</tomcatUserPassw>|" > ${APP_PATH}/pom.xml
RUN cat ${APP_PATH}/pom.xml | sed "s|<outputDirectory>[^ ]*</outputDirectory>|<outputDirectory>${TOMCAT_ROOT}/webapps/</outputDirectory>|" > ${APP_PATH}/pom.xml.tmp &&\
	mv ${APP_PATH}/pom.xml.tmp ${APP_PATH}/pom.xml
#RUN node ${APP_PATH}/src/main/webapp/build.js -p "${APP_PATH}/src/main/webapp/" -v "2.0beta" -w "/webservice"
RUN mvn -e -f ${APP_PATH}/pom.xml -P release clean package
#RUN chown -R tomcat ${TOMCAT_ROOT}/webapps/ ${TOMCAT_ROOT}/work/ ${TOMCAT_ROOT}/temp/ ${TOMCAT_ROOT}/logs/

ENTRYPOINT ${TOMCAT_ROOT}/bin/startup.sh &&\
  eval ${CMD_KEEP_ALIVE}
