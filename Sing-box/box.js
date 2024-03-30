const { type, name } = $arguments
const compatible_outbound = {
  tag: 'COMPATIBLE',
  type: 'direct',
}

let compatible
let config = JSON.parse($files[0])
let proxies = await produceArtifact({
  name,
  type: /^1$|col/i.test(type) ? 'collection' : 'subscription',
  platform: 'sing-box',
  produceType: 'internal',
})

config.outbounds.push(...proxies)

config.outbounds.map(i => {
  if (['自动选择'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies))
  }
  if (['香港节点'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /港|hk|hongkong|kong kong|🇭🇰/i))
  }
  if (['台湾节点'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /台|tw|taiwan|🇹🇼/i))
  }
  if (['日本节点'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /日本|jp|japan|🇯🇵/i))
  }
  if (['狮城节点'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /新|狮|獅|SG|Singapore/i))
  }
  if (['韩国节点'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /韩|韓|朝|KR|Korea/i))
  }
  if (['美国节点'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /美|US|States|American/i))
  }
})

config.outbounds.forEach(outbound => {
  if (Array.isArray(outbound.outbounds) && outbound.outbounds.length === 0) {
    if (!compatible) {
      config.outbounds.push(compatible_outbound)
      compatible = true
    }
    outbound.outbounds.push(compatible_outbound.tag);
  }
});

$content = JSON.stringify(config, null, 2)

function getTags(proxies, regex) {
  return (regex ? proxies.filter(p => regex.test(p.tag)) : proxies).map(p => p.tag)
}
