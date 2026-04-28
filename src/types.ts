export interface Track {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  audioUrl: string;
}

export interface GameState {
  score: number;
  wickets: number;
  balls: number;
  highScore: number;
  isPlaying: boolean;
}
