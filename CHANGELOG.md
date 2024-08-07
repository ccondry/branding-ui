# branding-ui Change Log

Version numbers are dates in semver-compatible YYYY.MM.DD-X format, where X
is an optional revision number for that day.


# 2024.7.29

### Updates
* **SMS:** Update name input field to SMS with Bot modal.


# 2024.7.26

### Updates
* **SMS:** Add name input field to SMS with Bot modal.


# 2024.7.25

### Updates
* **Contact Panel:** Organize contact menu options to voice call, callback,
email, sms, chat, task, other.


# 2024.7.23

### Updates
* **SMS:** Add US/UK country selection to the SMS modal form, and remove the
SMS deflection message as it is no longer used.


# 2024.2.20

### Fixes
* **Site:** Fix chat translation option appearing when it is disabled in the
current multichannel options.


# 2024.2.2

### Fixes
* **Site:** Fix UCCX channel options not appearing.


# 2024.2.1

### Fixes
* **Site:** Fix using default multichannel when no multichannel has been set in
session configuration.


# 2024.1.31

### Fixes
* **Site:** Fix channel options for Webex Connect demos with default
configuration still showing ECE channels.


# 2024.1.30-1

### Fixes
* **Site:** Fix channel options not showing when multichannel system has not
been configured yet.


# 2024.1.30

### Updates
* **Multichannel:** Set default multichannel to Webex Connect if ECE is not
available, or set it to the first option if neither of those is available.


# 2024.1.19

### Fixes
* **Webex Connect:** Fix Webex Contact Center chat not loading.


# 2024.1.18-2

### Updates
* **PCCE:** Use demo config IMI ID for PCCE Webex Connect chat div data ID.


# 2024.1.18-1

### Updates
* **PCCE:** Fix Webex Connect chat not loading.


# 2024.1.18

### Updates
* **PCCE:** Add support for Webex Connect multichannel chat.


# 2022.3.1

### Fixes
* **Webex v6:** Get IMI Connect ID from demo base configuration instead of
session configuration.


# 2022.2.16

### Fixes
* **ECE Docked Chat:** Fix ECE docked chat when using "aria" chat template -
init ECE docked chat at brand load time instead of when user clicks chat button.


# 2022.1.26

### Features
* **Build:** Update build libraries and build scripts.
* **Webex v6:** Add IMI Connect for Webex v6 demo.
* **Webex Custom:** Add IMI Connect for Webex Custom demo.


# 2021.11.5

### Features
* **Call:** Add callModalSalesforceLabel.


# 2021.4.27

### Features
* **Call:** Add callModalWxmVoiceLabel.


# 2021.3.2

### Bug Fixes
* **ECE Docked Chat:** Fixed ECE docked chat (chat live) entry point ID only
using the default 1001. Now it will use the appropriate ID for the demo and
user.


# 2021.2.27

### Bug Fixes
* **Webex CC Chat:** Hide the tooltip that gets in the way of clicking the
button to start Webex CC chat.


# 2021.2.9-1

### Bug Fixes
* **Chat Translation:** fix Chat Translation option not appearing


# 2021.2.9

### Features
* **Chat Translation:** add Chat Translation option


# 2021.2.1

### Features
* **Call:** add CCAI call label


# 2021.1.26-1

### Features
* **Instant Demo:** prompt for instant demo user ID if session ID and datacenter
were provided in URL but user ID was not


# 2021.1.26

### Features
* **UCCX Chat Live:** add updated bubble chat code for UCCX v12.5 demos


# 2021.1.25

### Features
* **WXM:** add support for WXM Email and WXM SMS labels in call modal
* **ECE Chat Live:** add error message when ECE chat live library fails to load
* **UCCX Chat Live:** load UCCX chat live (bubble chat) directly from the
CCP server's normal FQDN, instead of using the proxy which no longer seems to
work


# 2021.1.5

### Features
* **Email:** improve error message display when sending email fails


# 2020.12.17

### Features
* **Demos:** add support for webex-custom demo


# 2020.12.7-1

### Bug Fixes
* **Contact Panel:** center the contact panel vertically in the window


# 2020.12.7

### Bug Fixes
* **ECE Chat Live:** use "aqua" chat template for all versions of PCCE demo
instead of "cumulus_aqua"


# 2020.11.20

### Features
* **Channels:** get channel options from multichannel options in database


# 2020.10.21

### Features
* **ECE Chat Live:** show error message when the ECE chat library fails to load,
and retry it when user clicks chat button.

### Bug Fixes
* **Upstream Call:** fix phone number displayed for Upstream Works


# 1.22.1 (2020-10-06)

### Features

* **Demo Base Configs:** fix demo base config query for instant demos


# 1.22.0 (2020-10-01)

### Features

* **Demo Base Configs:** use POST route to find demo base configs with JSON body as query


# 1.21.0 (2020-10-01)

### Features

* **Call Form:** use mongo dcloud.demo info to determine call form phone numbers
* **Contact Panel:** use mongo dcloud.demo info to determine contact panel options	


# 1.20.2 (2020-10-01)

### Bug Fixes

* **PCCE 12.5CVA:** fix wrong phone number list displayed on Call Us form


# 1.20.1 (2020-10-01)

### Bug Fixes

* **Multichannel:** remove test values for multichannel selection


# 1.20.0 (2020-10-01)

### Features

* **Webex Teams:** improve experience by starting chat widget at load time, then
requesting agent and unhiding the chat window when user submits chat form


# 1.19.0 (2020-10-01)

### Features

* **Webex Teams:** add support for Webex Teams multichannel space widget 


# 1.18.0 (2020-09-30)

### Features

* **Webex CCE v2:** add support for Webex CCE v2 demo
* **Microsoft Dynamics:** add support for Microsoft Dynamics multichannel

### Bug Fixes

* **Salesforce:** fix chat style conflict (white text with white background)


# 1.17.0 (2020-09-24)

### Features

* **2Ring:** add 2Ring phone number for UCCX 12.5v2 demos


# 1.16.2 (2020-09-23)

### Bug Fixes

* **Salesforce:** add/update Salesforce chat button style


# 1.16.1 (2020-09-22)

### Bug Fixes

* **ServiceNow:** remove extra channel options from the panel


# 1.16.0 (2020-09-22)

### Features

* **ServiceNow:** only show inbound voice and callback options for ServiceNow multichannel
* **Salesforce:** add callback option for Salesforce multichannel


# 1.15.2 (2020-09-22)

### Bug Fixes

* **Salesforce:** remove contact panel options except inbound voice and email


# 1.15.1 (2020-09-21)

### Bug Fixes

* **Salesforce Chat:** fix Salesforce chat not being loaded


# 1.15.0 (2020-09-17)

### Features

* **PCCE 12.5v2:** add support for SalesForce.com email


# 1.14.0 (2020-09-17)

### Features

* **PCCE 12.5v2:** add support for SalesForce.com chat
* **UCCX 12.0 Enablement Lab:** set phone numbers


# 1.13.0 (2020-09-03)

### Features

* **Webex v4:** set new static main phone number


# 1.12.0 (2020-09-02)

### Features

* **PCCE 12.5v2:** add CRM phone number (DID3) to the call form