require 'net/http'
require 'json'

def current_page(page)
    return page + 1 if page
    return 1
end
def create_agent(page)
    uri = URI("https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=usman6&api_key=0e08aae0a272d5930546b07a17fe329d&format=json&limit=200")
    http = Net::HTTP.new(uri.host, uri.port)
    req = Net::HTTP::Post.new(uri.path, 'Content-Type' => 'application/json')
    res = http.request(req)
    puts "response #{res.body}"
rescue => e
    puts "failed #{e}"
end
