const api = "http://localhost:3001/api"

const headers = {
  'Accept': 'application/json'
}

export const getAllOrigins = () =>
  fetch(`${api}/origins`, { headers })
    .then(res => res.json())
    .then(data => data.origins)


export const getAllDestiniesByOriginId = (originId) =>
    fetch(`${api}/destinies/${originId}`, { headers })
      .then(res => res.json())
      .then(data => data.destinies)


export const getAllPlans = () =>
    fetch(`${api}/plans`, { headers })
    .then(res => res.json())
    .then(data => data.plans)

export const getCallValue = (planId, destinieId, totalCallMinutes) =>
    fetch(`${api}/plan/${planId}/${destinieId}?totalCallMinutes=${totalCallMinutes}`, { headers })
    .then(res => res.json())
    .then(data => data)