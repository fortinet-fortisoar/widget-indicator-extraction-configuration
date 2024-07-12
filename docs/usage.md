
| [Home](../README.md) |
|--------------------------------------------|

# Usage

The Configure Indicator Extraction wizard helps you configure indicators to be excluded during the IOC (Indicator of Compromise) extraction process within your FortiSOAR environment. In this wizard, you can add one or multiple IOCs specific to your organization.

You can review and edit settings for below indicator types;
- IP Addresses
- URLs
- Domains
- Ports
- Files
- CIDR Ranges


### Launch Configuration Wizard
- Launch **Setup Guide**
  
  ![setup-guide-launch-point](../docs/res/setup-guide-launch-point.png)
  
- Locate **Streamline** section

![setup-guide-launch-point](../docs/res/setup-guide-streamline-section.png)
  
- Locate **Configure Indicator Extraction** section
  
![setup-guide-launch-point](../docs/res/setup-guide-indicator-extraction-section.png)

- Click on **Configure Exclude List** button under **Configure Indicator Extraction** section

![setup-guide-launch-point](../docs/res/setup-guide-configure-exclude-list.png)


### Edit Configuration Settings
- User can review configuration settings and make edits as per the requirement

![setup-guide-launch-point](../docs/res/indicator-extraction-settings-page.png)

- Click **Save** button to make setting persistant


>**Note** By default, all these fields are loaded from the record labeled as `sfsp-extraction-*` within the Key Store Module.
