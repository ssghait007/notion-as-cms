var axios = require('axios')
var fs = require('fs')

var data = JSON.stringify({
  sorts: [
    {
      property: 'Status',
      direction: 'ascending',
    },
  ],
  filter: {
    property: 'Status',
    rich_text: {
      equals: 'Done',
    },
  },
})

const NOTION_API_KEY = process.env.NOTION_API_KEY
const NOTION_DB_ID = process.env.NOTION_DB_ID

var config = {
  method: 'post',
  url: `https://api.notion.com/v1/databases/${NOTION_DB_ID}/query`,
  headers: {
    Authorization: `Bearer ${NOTION_API_KEY}`,
    'Notion-Version': '2022-02-22',
    'Content-Type': 'application/json',
  },
  data: data,
}

axios(config)
  .then(function (response) {
    let team = response.data.results.map((f) => ({
      name: f.properties.Name.title[0].text.content,
      jobTitle: f.properties.jobTitle.rich_text[0].text.content,
      profilePic: f.properties.profilePic.rich_text[0].text.content,
      rank: f.properties.rank.rich_text[0].text.content,
    }))

    team.sort((a, b) => a.rank - b.rank)

    fs.writeFileSync('./cms/team.json', JSON.stringify(team, null, 2), 'utf-8')
  })
  .catch(function (error) {
    console.log(error)
  })
