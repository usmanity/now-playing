require 'byebug'
require 'set'

def read_file(file_name)
  file = File.open(file_name, "r")
  data = file.read
  file.close
  return data
end

def get_lines(data)
  lines = data.gsub("\n", "|")
  lines = lines.split('|')
  lines
end

file_data = read_file('songs.csv')
lines = get_lines(file_data)

unique_songs = Set[]

known_things = %w[Lowercase Noises, System, Choralschola, Slum Village, 
Fleet Foxes, El Ten, Drake, Coldplay, Fateh Ali Khan Mitch
Hendrix Przybyłowicz Percival Angie Junoon Love TLC Against Matchbox
Cypress Hill Blues Guerrilla Peril Plastic Alghalem David Nightcall Bamboleo
Je Suis Le Vent Stroinski
Kanye West
Traditional
]

lines.each do |line|
  unless known_things.any? { |thing| line.include? thing }
    unique_songs.add(line)
  end
end

unique_songs.each { |l| puts l }


# puts "Looking for file"

# puts "----done----"
