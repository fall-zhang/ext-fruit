import faker from 'faker'
import '@/selection'
import { initConfig, updateConfig } from '@/_helpers/config-manager'
import { initProfiles, updateProfile } from '@/_helpers/profile-manager'
import { ProfileMutable } from '@/app-config/profiles'
import { AppConfigMutable } from '@/app-config'

browser.runtime.sendMessage._sender.callsFake(() => ({
  tab: {
    id: 'saladict-page'
  }
}))

initConfig().then(_config => {
  const config = _config as AppConfigMutable
  config.mode.instant.enable = true
  config.panelMode.direct = true
  updateConfig(config)
})
initProfiles().then((profile:ProfileMutable) => {
  const newProfile = {
    ...profile
  }
  newProfile.dicts.selected = ['bing']
  updateProfile(newProfile)
})

for (let i = 0; i < 10; i++) {
  const $p = document.createElement('p')
  $p.innerHTML = 'love ' + faker.lorem.paragraph()
  document.body.appendChild($p)
}
