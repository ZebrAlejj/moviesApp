import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CarteleraResponse, Movie } from '../interfaces/cartelera-response';

import { catchError, map, tap } from "rxjs/operators";
import { MovieDetails } from '../interfaces/movie-response';
import { Cast, CreditsResponse } from '../interfaces/credits-reponse';

@Injectable({
  providedIn: 'root'
})
export class PeliculasService {

  private baseUrl: string = 'https://api.themoviedb.org/3';
  private carteleraPage = 1;
  
  public loading = false;

  constructor( private http: HttpClient) { }

  get params(){
    return{
      api_key:'ec90b1b10e319c58897574afce91e263',
      language:'en-US',
      page:this.carteleraPage.toString()
    }
  }

  resetCarteleraPage(){
    this.carteleraPage = 1;
  }
  
  //Observable para poner que es de tipo Movie[]
  getCartelera():Observable<Movie[]>{

    if (this.loading) {
      return of([])
    }

    this.loading = true;

    return this.http.get<CarteleraResponse>(`${this.baseUrl}/movie/now_playing?`,{
      params: this.params
    }).pipe(
      map((reps) => reps.results),
      tap(() => {
        this.carteleraPage += 1;
        this.loading = false;
      })
    )
  
  }

  buscarPeliculas( texto:string):Observable<Movie[]>{
    const params = {...this.params, page: '1', query: texto};

    return this.http.get<CarteleraResponse>(`${this.baseUrl}/search/movie`, {
      params
    }).pipe(
      map( resp => resp.results)
    )
  }

  getPeliculaDetalle(id:string):Observable<MovieDetails>{
    return this.http.get<MovieDetails>(`${this.baseUrl}/movie/${id}`,{
      params:this.params
    }).pipe(
      catchError( err => of(null) )
    )
  }

  getCast(id:string):Observable<Cast[]>{
    return this.http.get<CreditsResponse>(`${this.baseUrl}/movie/${id}/credits`,{
      params:this.params
    }).pipe(
      map( resp => resp.cast ),
      catchError( err => of([]) )
    )
  }
}
